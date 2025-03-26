package com.microservices.event_service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservices.event_service.models.request.*;
import com.microservices.event_service.services.EventCommandService;
import com.microservices.event_service.services.EventQueryService;
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

    private final EventCommandService eventCommandService;
    private final EventQueryService eventQueryService;
    private final ObjectMapper objectMapper;

    @RabbitListener(
            bindings = @QueueBinding(
                    value = @Queue(value = "event.queue", durable = "true"),
                    exchange = @Exchange(value = "event-exchange", type = ExchangeTypes.TOPIC),
                    key = "event.*"
            )
    )
    public String handleAuthRequest(String payload, Message message) {
        String routingKey = message.getMessageProperties().getReceivedRoutingKey();

        try {
            Map<String, String> result = switch (routingKey) {
                case "event.createEvent" -> {
                    CreateEventRequest createEventRequest = objectMapper.readValue(payload, CreateEventRequest.class);
                    yield eventCommandService.createEvent(createEventRequest);
                }
                case "event.deleteEvent" -> {
                    DeleteEventRequest deleteEventRequest = objectMapper.readValue(payload, DeleteEventRequest.class);
                    yield eventCommandService.deleteEvent(deleteEventRequest);
                }
                case "event.getAllEvents" -> {
                    GetAllEventsRequest getAllEventsRequest = objectMapper.readValue(payload, GetAllEventsRequest.class);
                    yield eventQueryService.getAllEvents(getAllEventsRequest);
                }
                case "event.getEventById" -> {
                    GetEventByIdRequest getEventByIdRequest = objectMapper.readValue(payload, GetEventByIdRequest.class);
                    yield eventQueryService.getEventById(getEventByIdRequest);
                }
                case "event.updateEvent" -> {
                    UpdateEventRequest updateEventRequest = objectMapper.readValue(payload, UpdateEventRequest.class);
                    yield eventCommandService.updateEvent(updateEventRequest);
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