package com.microservices.payment_service.dao;

import com.microservices.payment_service.models.Event;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EventDao {

    private final MongoTemplate mongoTemplate;

    private static final String EVENT_COLLECTION = "EVENTS";

    public boolean doesNotExistsById(String id) {
        Query query = new Query(Criteria.where("_id").is(id));
        return !mongoTemplate.exists(query, Event.class, EVENT_COLLECTION);
    }

}
