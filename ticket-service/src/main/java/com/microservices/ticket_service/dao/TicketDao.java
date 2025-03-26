package com.microservices.ticket_service.dao;

import com.microservices.ticket_service.models.Ticket;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class TicketDao {

    private final MongoTemplate mongoTemplate;

    private static final String TICKET_COLLECTION = "TICKETS";

    public void save(Ticket ticket) {
        mongoTemplate.save(ticket, TICKET_COLLECTION);
    }

    public Optional<Ticket> findById(String ticketId) {
        return Optional.ofNullable(mongoTemplate.findById(ticketId, Ticket.class, TICKET_COLLECTION));
    }

    public void delete(String ticketId) {
        mongoTemplate.remove(new Query(Criteria.where("_id").is(ticketId)), TICKET_COLLECTION);
    }

    public List<Ticket> getUserTickets(String userId) {
        Query query = new Query(Criteria.where("userId").is(userId));
        return mongoTemplate.find(query, Ticket.class, TICKET_COLLECTION);
    }
}
