package com.microservices.ticket_service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservices.ticket_service.models.request.CancelTicketRequest;
import com.microservices.ticket_service.models.request.CreateTicketsRequest;
import com.microservices.ticket_service.models.request.GetCurrentUserTicketsRequest;
import com.microservices.ticket_service.models.request.ValidateTicketRequest;
import com.microservices.ticket_service.services.TicketCreationService;
import com.microservices.ticket_service.services.TicketManagementService;
import com.microservices.ticket_service.services.TicketRetrievalService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.ExchangeTypes;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class Consumer {

    private final TicketCreationService ticketCreationService;
    private final TicketManagementService ticketManagementService;
    private final TicketRetrievalService ticketRetrievalService;
    private final ObjectMapper objectMapper;

    @RabbitListener(
            bindings = @QueueBinding(
                    value = @Queue(value = "ticket.queue", durable = "true"),
                    exchange = @Exchange(value = "ticket-exchange", type = ExchangeTypes.TOPIC),
                    key = "ticket.*"
            )
    )
    public String handleAuthRequest(String payload, Message message) {
        String routingKey = message.getMessageProperties().getReceivedRoutingKey();

        try {
            Map<String, String> result = switch (routingKey) {
                case "ticket.createTickets" -> {
                    CreateTicketsRequest createTicketsRequest = objectMapper.readValue(payload, CreateTicketsRequest.class);
                    yield ticketCreationService.createTickets(createTicketsRequest);
                }
                case "ticket.getCurrentUserTickets" -> {
                    GetCurrentUserTicketsRequest getCurrentUserTicketsRequest = objectMapper.readValue(payload, GetCurrentUserTicketsRequest.class);
                    yield ticketRetrievalService.getCurrentUserTickets(getCurrentUserTicketsRequest);
                }
                case "ticket.cancelTicket" -> {
                    CancelTicketRequest cancelTicketRequest = objectMapper.readValue(payload, CancelTicketRequest.class);
                    yield ticketManagementService.cancelTicket(cancelTicketRequest);
                }
                case "ticket.validateTicket" -> {
                    ValidateTicketRequest validateTicketRequest = objectMapper.readValue(payload, ValidateTicketRequest.class);
                    yield ticketManagementService.validateTicket(validateTicketRequest);
                }
                default -> throw new IllegalStateException("Unexpected value: " + routingKey);
            };

            return objectMapper.writeValueAsString(result);
        } catch (Exception e) {
            try {
                return objectMapper.writeValueAsString(Map.of("error", e.getMessage()));
            } catch (JsonProcessingException ex) {
                return "{\"error\": \"Internal server error\"}";
            }
        }
    }
}