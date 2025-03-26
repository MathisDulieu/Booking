package com.microservices.event_service.services;

import com.microservices.event_service.UuidProvider;
import com.microservices.event_service.dao.EventDao;
import com.microservices.event_service.models.Event;
import com.microservices.event_service.models.EventType;
import com.microservices.event_service.models.request.CreateEventRequest;
import com.microservices.event_service.models.request.DeleteEventRequest;
import com.microservices.event_service.models.request.UpdateEventRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

import static java.util.Collections.singletonMap;
import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
public class EventCommandService {

    private final EventDao eventDao;
    private final UuidProvider uuidProvider;

    public Map<String, String> createEvent(CreateEventRequest request) {
        List<String> errors = new ArrayList<>();
        validateRequest(errors, request);
        if (!errors.isEmpty()) {
            return singletonMap("BAD_REQUEST", getErrorsAsString(errors));
        }

        EventType eventType = getEventType(request.getEventType());
        int availableTickets = request.getAvailableStandardTickets() + request.getAvailablePremiumTickets() + request.getAvailableVIPTickets();

        Event event = buildEvent(request, availableTickets, eventType);

        eventDao.save(event);

        return singletonMap("message", "Event created successfully");
    }

    public Map<String, String> updateEvent(UpdateEventRequest request) {
        Optional<Event> optionalEvent = eventDao.findById(request.getEventId());
        if (optionalEvent.isEmpty()) {
            return singletonMap("NOT_FOUND", "Event not found");
        }

        Event event = optionalEvent.get();
        if (!Objects.equals(event.getOrganizerId(), request.getUserId())) {
            return singletonMap("FORBIDDEN", "You are not authorized to update this event");
        }

        List<String> errors = new ArrayList<>();

        validateRequest(errors, request, event);
        if (!errors.isEmpty()) {
            return singletonMap("BAD_REQUEST", getErrorsAsString(errors));
        }

        eventDao.save(event);

        return singletonMap("message", "Event with id: " + request.getEventId() + " updated successfully");
    }

    public Map<String, String> deleteEvent(DeleteEventRequest request) {
        Optional<Event> optionalEvent = eventDao.findById(request.getEventId());
        if (optionalEvent.isEmpty()) {
            return singletonMap("NOT_FOUND", "Event not found");
        }

        Event event = optionalEvent.get();
        if (!Objects.equals(event.getOrganizerId(), request.getUserId())) {
            return singletonMap("FORBIDDEN", "You are not authorized to delete this event");
        }

        eventDao.delete(request.getEventId());

        return singletonMap("message", "Event deleted successfully");
    }

    private Event buildEvent(CreateEventRequest request, int availableTickets, EventType eventType) {
        return Event.builder()
                .id(uuidProvider.generateUuid())
                .name(request.getName())
                .address(request.getAddress())
                .description(request.getDescription())
                .artists(request.getArtists())
                .eventType(eventType)
                .availableStandardTickets(request.getAvailableStandardTickets())
                .availablePremiumTickets(request.getAvailablePremiumTickets())
                .availableVIPTickets(request.getAvailableVIPTickets())
                .standardTicketsPrice(request.getStandardTicketsPrice())
                .premiumTicketsPrice(request.getPremiumTicketsPrice())
                .VIPTicketsPrice(request.getVIPTicketsPrice())
                .availableTickets(availableTickets)
                .organizerId(request.getOrganizerId())
                .endTime(request.getEndTime())
                .startTime(request.getStartTime())
                .imageUrl(request.getImageUrl())
                .minimumPrice(request.getStandardTicketsPrice())
                .totalTickets(availableTickets)
                .build();
    }

    private EventType getEventType(String eventType) {
        try {
            return EventType.valueOf(eventType.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private void validateRequest(List<String> errors, UpdateEventRequest request, Event event) {
        if (isNull(request.getName()) && isNull(request.getAddress()) && isNull(request.getDescription()))
            errors.add("At least one field (name, address, or description) must be provided for update");
        if (!isNull(request.getName())) {
            validateEventName(errors, request.getName());
            event.setName(request.getName());
        }
        if (!isNull(request.getDescription())) {
            validateEventDescription(errors, request.getDescription());
            event.setDescription(request.getDescription());
        }
        if (!isNull(request.getAddress())) {
            validateEventAddress(errors, request.getAddress());
            event.setAddress(request.getAddress());
        }
    }

    private void validateRequest(List<String> errors, CreateEventRequest request) {
        validateEventName(errors, request.getName());
        validateEventAddress(errors, request.getAddress());
        validateTicketCounts(errors, request);
        validateEventDescription(errors, request.getDescription());
        validateTicketPrices(errors, request);
        validateEventTimes(errors, request.getStartTime(), request.getEndTime());
        validateImageUrl(errors, request.getImageUrl());
        validateEventType(errors, request.getEventType());
    }

    private void validateEventName(List<String> errors, String name) {
        if (name.length() < 3 || name.length() > 15) {
            errors.add("Event name must be between 3 and 15 characters");
        }
    }

    private void validateEventAddress(List<String> errors, String address) {
        if (address.length() < 3 || address.length() > 30) {
            errors.add("Event address must be between 3 and 30 characters");
        }
    }

    private void validateTicketCounts(List<String> errors, CreateEventRequest request) {
        if (request.getAvailablePremiumTickets() < 0) {
            errors.add("Premium tickets count cannot be negative");
        }

        if (request.getAvailableStandardTickets() < 0) {
            errors.add("Standard tickets count cannot be negative");
        }

        if (request.getAvailableVIPTickets() < 0) {
            errors.add("VIP tickets count cannot be negative");
        }
    }

    private void validateEventDescription(List<String> errors, String description) {
        if (description.length() > 150) {
            errors.add("Event description cannot exceed 150 characters");
        }
    }

    private void validateTicketPrices(List<String> errors, CreateEventRequest request) {
        if (request.getStandardTicketsPrice() <= 0) {
            errors.add("Standard ticket price must be greater than zero");
        }

        if (request.getPremiumTicketsPrice() <= 0) {
            errors.add("Premium ticket price must be greater than zero");
        }

        if (request.getVIPTicketsPrice() <= 0) {
            errors.add("VIP ticket price must be greater than zero");
        }
    }

    private void validateEventTimes(List<String> errors, LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime.isBefore(LocalDateTime.now())) {
            errors.add("Event start time cannot be in the past");
        }

        if (endTime.isBefore(startTime)) {
            errors.add("Event end time must be after start time");
        }
    }

    private void validateImageUrl(List<String> errors, String imageUrl) {
        if (!imageUrl.startsWith("https://")) {
            errors.add("Image URL must start with 'https://'");
        }
    }

    private void validateEventType(List<String> errors, String eventType) {
        if (!isValidEventType(eventType)) {
            errors.add("Invalid event type. Must be either 'FESTIVAL' or 'CONCERT'");
        }
    }

    private boolean isValidEventType(String eventType) {
        for (EventType validEventType : EventType.values()) {
            if (validEventType.name().equalsIgnoreCase(eventType)) {
                return true;
            }
        }
        return false;
    }

    private String getErrorsAsString(List<String> errors) {
        return String.join(" | ", errors);
    }

}
