package com.microservices.ticket_service.dao;

import com.microservices.ticket_service.models.Event;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class EventDao {

    private final MongoTemplate mongoTemplate;

    private static final String EVENT_COLLECTION = "EVENTS";

    public Optional<Event> findById(String eventId) {
        return Optional.ofNullable(mongoTemplate.findById(eventId, Event.class, EVENT_COLLECTION));
    }

}
