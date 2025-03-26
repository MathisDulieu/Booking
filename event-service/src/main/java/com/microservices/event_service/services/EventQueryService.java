package com.microservices.event_service.services;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.microservices.event_service.dao.EventDao;
import com.microservices.event_service.models.Event;
import com.microservices.event_service.models.Filter;
import com.microservices.event_service.models.request.GetAllEventsRequest;
import com.microservices.event_service.models.request.GetEventByIdRequest;
import com.microservices.event_service.models.response.GetAllEventsResponse;
import com.microservices.event_service.models.response.GetEventByIdResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.util.Collections.singletonMap;
import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
public class EventQueryService {

    private final EventDao eventDao;

    public Map<String, String> getAllEvents(GetAllEventsRequest request) throws JsonProcessingException {
        GetAllEventsResponse response = GetAllEventsResponse.builder().build();
        request.setPageSize(getPageSizeValue(request.getPageSize()));

        String error = validateRequest(request);
        if (!isNull(error)) {
            response.setError(error);
            return singletonMap("BAD_REQUEST", convertObjectToJsonString(response));
        }

        long totalEvents = eventDao.countEventsWithRequest(request.getFilter(), request.getFilterSearch());
        response.setEventsFound(totalEvents);
        if (totalEvents == 0) {
            response.setError("No event found");
            return singletonMap("warning", convertObjectToJsonString(response));
        }

        int totalPages = getTotalPages(totalEvents, request.getPageSize());
        response.setTotalPages(totalPages);

        if (request.getPage() > totalPages) {
            response.setError("Requested page exceeds the total number of available pages");
            return singletonMap("warning", convertObjectToJsonString(response));
        }

        List<Event> events = eventDao.searchEventsByRequest(request.getFilter(), request.getFilterSearch(), request.getPage(), request.getPageSize());

        response.setEvents(events);

        return singletonMap("events", convertObjectToJsonString(response));
    }

    public Map<String, String> getEventById(GetEventByIdRequest request) throws JsonProcessingException {
        Optional<Event> optionalEvent = eventDao.findById(request.getEventId());
        GetEventByIdResponse response = GetEventByIdResponse.builder().build();

        if (optionalEvent.isEmpty()) {
            response.setError("Event not found");
            return singletonMap("NOT_FOUND", convertObjectToJsonString(response));
        }

        response.setEvent(optionalEvent.get());

        return singletonMap("informations", convertObjectToJsonString(response));
    }

    private int getPageSizeValue(int pageSize) {
        return (pageSize == 0) ? 10 : pageSize;
    }

    private String validateRequest(GetAllEventsRequest request) {
        if (request.getPage() < 0) return "Page number must be greater than or equal to zero";
        if (!isValidFilter(request.getFilter())) return "Invalid filter provided";
        if (request.getPageSize() < 0) return "Page size must be greater than or equal to zero";
        return null;
    }

    private boolean isValidFilter(String filter) {
        for (Filter validFilter : Filter.values()) {
            if (validFilter.name().equalsIgnoreCase(filter)) {
                return true;
            }
        }
        return false;
    }

    private String convertObjectToJsonString(Object object) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();

        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectMapper.registerModule(new JavaTimeModule());

        return objectMapper.writeValueAsString(object);
    }

    private int getTotalPages(long totalEvents, int pageSize) {
        return (int) Math.ceil((double) totalEvents / pageSize);
    }

}
