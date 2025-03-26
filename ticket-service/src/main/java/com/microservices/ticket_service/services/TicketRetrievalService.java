package com.microservices.ticket_service.services;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.microservices.ticket_service.dao.TicketDao;
import com.microservices.ticket_service.models.Ticket;
import com.microservices.ticket_service.models.request.GetCurrentUserTicketsRequest;
import com.microservices.ticket_service.models.response.GetCurrentUserTicketsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

import static java.util.Collections.singletonMap;

@Service
@RequiredArgsConstructor
public class TicketRetrievalService {

    private final TicketDao ticketDao;

    public Map<String, String> getCurrentUserTickets(GetCurrentUserTicketsRequest request) throws JsonProcessingException {
        GetCurrentUserTicketsResponse response = GetCurrentUserTicketsResponse.builder().build();

        List<Ticket> tickets =  ticketDao.getUserTickets(request.getUserId());

        if (tickets.isEmpty()) {
            response.setError("No tickets found for this user");
            return singletonMap("warning", convertObjectToJsonString(tickets));
        }

        response.setTickets(tickets);

        return singletonMap("message", convertObjectToJsonString(response));
    }

    private String convertObjectToJsonString(Object object) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();

        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectMapper.registerModule(new JavaTimeModule());

        return objectMapper.writeValueAsString(object);
    }

}
