package com.microservices.api_gateway.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservices.api_gateway.Producer;
import com.microservices.api_gateway.models.dto.request.event.*;
import com.microservices.api_gateway.models.dto.response.event.GetAllEventsResponse;
import com.microservices.api_gateway.models.dto.response.event.GetEventByIdResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

import static java.util.Collections.singletonMap;

@Service
@RequiredArgsConstructor
public class EventService {

    private final Producer producer;
    private final ErrorResponseService errorResponseService;

    private <T> ResponseEntity<Map<String, String>> sendEventRequest(String routingKey, T request) {
        try {
            Map<String, String> response = producer.sendAndReceive(
                    "event-exchange",
                    routingKey,
                    request,
                    Map.class
            );

            if (response == null) {
                return ResponseEntity.internalServerError()
                        .body(Map.of("error", "Aucune réponse reçue du service d'événement"));
            }

            return errorResponseService.mapToResponseEntity(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Erreur lors de la communication avec le service d'événement: " + e.getMessage()));
        }
    }

    public <T, R> ResponseEntity<Map<String, R>> sendAndProcessEventRequest(String endpoint, T request, Class<R> responseClass) throws JsonProcessingException {
        try {
            ResponseEntity<Map<String, String>> response = sendEventRequest(endpoint, request);
            HttpStatusCode status = response.getStatusCode();
            Map<String, String> responseBody = response.getBody();

            if (responseBody == null || responseBody.isEmpty()) {
                return ResponseEntity.status(HttpStatusCode.valueOf(500))
                        .body(singletonMap("error", createErrorResponse(responseClass, "Réponse vide reçue du service")));
            }

            String key = responseBody.keySet().iterator().next();
            String jsonValue = responseBody.get(key);

            if (jsonValue == null || !(jsonValue.trim().startsWith("{") || jsonValue.trim().startsWith("["))) {
                return ResponseEntity.status(HttpStatusCode.valueOf(500))
                        .body(singletonMap("error", createErrorResponse(responseClass, "Erreur du service: " + jsonValue)));
            }

            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());

            R userResponse = objectMapper.readValue(jsonValue, responseClass);
            Map<String, R> result = singletonMap(key, userResponse);
            return ResponseEntity.status(status).body(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatusCode.valueOf(500))
                    .body(singletonMap("error", createErrorResponse(responseClass, "Erreur de traitement: " + e.getMessage())));
        }
    }

    @SuppressWarnings("unchecked")
    private <R> R createErrorResponse(Class<R> responseClass, String errorMessage) {
        try {
            if (responseClass.equals(GetAllEventsResponse.class)) {
                return (R) GetAllEventsResponse.builder()
                        .error(errorMessage)
                        .build();
            } else if (responseClass.equals(GetEventByIdResponse.class)) {
                return (R) GetEventByIdResponse.builder()
                        .error(errorMessage)
                        .build();
            } else {
                try {
                    Object instance = responseClass.getDeclaredConstructor().newInstance();
                    responseClass.getMethod("setError", String.class).invoke(instance, errorMessage);
                    return (R) instance;
                } catch (Exception e) {
                    return null;
                }
            }
        } catch (Exception e) {
            return null;
        }
    }

    public ResponseEntity<Map<String, String>> createEvent(CreateEventRequest request, String authenticatedUserId) {
        request.setOrganizerId(authenticatedUserId);
        return sendEventRequest("event.createEvent", request);
    }

    public ResponseEntity<Map<String, GetEventByIdResponse>> getEventById(String eventId) throws JsonProcessingException {
        GetEventByIdRequest request = new GetEventByIdRequest(eventId);
        return sendAndProcessEventRequest("event.getEventById", request, GetEventByIdResponse.class);
    }

    public ResponseEntity<Map<String, String>> updateEvent(UpdateEventRequest request, String authenticatedUserId) {
        request.setUserId(authenticatedUserId);
        return sendEventRequest("event.updateEvent", request);
    }

    public ResponseEntity<Map<String, String>> deleteEvent(String eventId, String authenticatedUserId) {
        DeleteEventRequest request = new DeleteEventRequest(eventId, authenticatedUserId);
        return sendEventRequest("event.deleteEvent", request);
    }

    public ResponseEntity<Map<String, GetAllEventsResponse>> getAllEvents(int page, int pageSize, String filter, String filterSearch) throws JsonProcessingException {
        GetAllEventsRequest request = new GetAllEventsRequest(page, pageSize, filter, filterSearch);
        return sendAndProcessEventRequest("event.getAllEvents", request, GetAllEventsResponse.class);
    }

}
