package com.microservices.payment_service.dao;

import com.microservices.payment_service.models.Ticket;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TicketDao {

    private final MongoTemplate mongoTemplate;

    private static final String TICKET_COLLECTION = "TICKETS";

    public boolean doesNotExistsById(String id) {
        Query query = new Query(Criteria.where("_id").is(id));
        return !mongoTemplate.exists(query, Ticket.class, TICKET_COLLECTION);
    }

}
