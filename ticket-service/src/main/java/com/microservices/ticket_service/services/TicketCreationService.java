package com.microservices.ticket_service.services;

import com.microservices.ticket_service.UuidProvider;
import com.microservices.ticket_service.dao.EventDao;
import com.microservices.ticket_service.dao.TicketDao;
import com.microservices.ticket_service.models.Event;
import com.microservices.ticket_service.models.Ticket;
import com.microservices.ticket_service.models.TicketCategory;
import com.microservices.ticket_service.models.request.CreateTicketsRequest;
import com.microservices.ticket_service.models.request.CreateTicketsTicketRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.util.Collections.singletonMap;

@Service
@RequiredArgsConstructor
public class TicketCreationService {

    private final TicketDao ticketDao;
    private final EventDao eventDao;
    private final UuidProvider uuidProvider;

    public Map<String, String> createTickets(CreateTicketsRequest request) {
        List<String> errors = new ArrayList<>();

        request.getTickets().forEach(ticketRequest -> {
            validateTicketRequest(errors, ticketRequest, request.getUserId());
        });

        if (!errors.isEmpty()) {
            return singletonMap("BAD_REQUEST", getErrorsAsString(errors));
        }

        return singletonMap("message", "Tickets created successfully");
    }

    private void validateTicketRequest(List<String> errors, CreateTicketsTicketRequest ticketRequest, String userId) {
        validateTicketData(errors, ticketRequest);

        Optional<Event> optionalEvent = eventDao.findById(ticketRequest.getEventId());
        if (optionalEvent.isEmpty()) {
            errors.add("Event not found for the specified ID");
        }

        TicketCategory ticketCategory = getTicketCategory(ticketRequest.getTicketCategory());
        Ticket ticket = buildTicket(ticketRequest, ticketCategory, userId);

        ticketDao.save(ticket);
    }

    private TicketCategory getTicketCategory(String ticketCategory) {
        try {
            return TicketCategory.valueOf(ticketCategory.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private Ticket buildTicket(CreateTicketsTicketRequest ticketRequest, TicketCategory ticketCategory, String userId) {
        return Ticket.builder()
                .id(uuidProvider.generateUuid())
                .eventId(ticketRequest.getEventId())
                .price(ticketRequest.getPrice())
                .qrCodeData(uuidProvider.generateUuid())
                .ticketCategory(ticketCategory)
                .userId(userId)
                .build();
    }

    private void validateTicketData(List<String> errors, CreateTicketsTicketRequest ticketRequest) {
        if (ticketRequest.getPrice() <= 0) errors.add("Ticket price must be greater than zero");
        if (!isValidTicketCategory(ticketRequest.getTicketCategory())) errors.add("Invalid ticket category");
    }

    private boolean isValidTicketCategory(String ticketCategory) {
        for (TicketCategory validTicketCategory : TicketCategory.values()) {
            if (validTicketCategory.name().equalsIgnoreCase(ticketCategory)) {
                return true;
            }
        }
        return false;
    }

    private String getErrorsAsString(List<String> errors) {
        return String.join(" | ", errors);
    }

}
