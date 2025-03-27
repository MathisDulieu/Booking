package com.microservices.api_gateway.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservices.api_gateway.Producer;
import com.microservices.api_gateway.models.dto.request.ticket.CancelTicketRequest;
import com.microservices.api_gateway.models.dto.request.ticket.CreateTicketsRequest;
import com.microservices.api_gateway.models.dto.request.ticket.GetCurrentUserTicketsRequest;
import com.microservices.api_gateway.models.dto.request.ticket.ValidateTicketRequest;
import com.microservices.api_gateway.models.dto.response.ticket.GetCurrentUserTicketsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

import static java.util.Collections.singletonMap;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final Producer producer;
    private final ErrorResponseService errorResponseService;

    @SuppressWarnings("unchecked")
    private <T> ResponseEntity<Map<String, String>> sendTicketRequest(String routingKey, T request) {
        try {
            Map<String, String> response = producer.sendAndReceive(
                    "ticket-exchange",
                    routingKey,
                    request,
                    Map.class
            );

            if (response == null) {
                return ResponseEntity.internalServerError()
                        .body(Map.of("error", "No response received from the ticket service"));
            }

            return errorResponseService.mapToResponseEntity(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error communicating with the ticket service: " + e.getMessage()));
        }
    }

    @SuppressWarnings("unchecked")
    private <T, R> ResponseEntity<Map<String, R>> sendAndProcessTicketRequest(T request) {
        try {
            ResponseEntity<Map<String, String>> response = sendTicketRequest("ticket.getCurrentUserTickets", request);
            HttpStatusCode status = response.getStatusCode();
            Map<String, String> responseBody = response.getBody();

            if (responseBody.isEmpty()) {
                return ResponseEntity.status(HttpStatusCode.valueOf(500))
                        .body(singletonMap("error", createErrorResponse((Class<R>) GetCurrentUserTicketsResponse.class, "Empty response received from service")));
            }

            String key = responseBody.keySet().iterator().next();
            String jsonValue = responseBody.get(key);

            if (jsonValue == null || !(jsonValue.trim().startsWith("{") || jsonValue.trim().startsWith("["))) {
                return ResponseEntity.status(HttpStatusCode.valueOf(500))
                        .body(singletonMap("error", createErrorResponse((Class<R>) GetCurrentUserTicketsResponse.class, "Service error: " + jsonValue)));
            }

            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());

            R userResponse = objectMapper.readValue(jsonValue, (Class<R>) GetCurrentUserTicketsResponse.class);
            Map<String, R> result = singletonMap(key, userResponse);
            return ResponseEntity.status(status).body(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatusCode.valueOf(500))
                    .body(singletonMap("error", createErrorResponse((Class<R>) GetCurrentUserTicketsResponse.class, "Processing error: " + e.getMessage())));
        }
    }

    @SuppressWarnings("unchecked")
    private <R> R createErrorResponse(Class<R> responseClass, String errorMessage) {
        try {
            if (responseClass.equals(GetCurrentUserTicketsResponse.class)) {
                return (R) GetCurrentUserTicketsResponse.builder()
                        .error(errorMessage)
                        .build();
            } else {
                try {
                    R instance = responseClass.getDeclaredConstructor().newInstance();
                    responseClass.getMethod("setError", String.class).invoke(instance, errorMessage);
                    return instance;
                } catch (Exception e) {
                    return null;
                }
            }
        } catch (Exception e) {
            return null;
        }
    }

    public ResponseEntity<Map<String, String>> cancelTicket(String ticketId, String userId) {
        CancelTicketRequest request = new CancelTicketRequest(ticketId, userId);
        return sendTicketRequest("ticket.cancelTicket", request);
    }

    public ResponseEntity<Map<String, GetCurrentUserTicketsResponse>> getCurrentUserTickets(String authenticatedUserId) {
        GetCurrentUserTicketsRequest request = new GetCurrentUserTicketsRequest(authenticatedUserId);
        return sendAndProcessTicketRequest(request);
    }

    public ResponseEntity<Map<String, String>> validateTicket(String ticketId) {
        ValidateTicketRequest request = new ValidateTicketRequest(ticketId);
        return sendTicketRequest("ticket.validateTicket", request);
    }

    public ResponseEntity<Map<String, String>> createTickets(CreateTicketsRequest request, String authenticatedUserId) {
        request.setUserId(authenticatedUserId);
        return sendTicketRequest("ticket.createTickets", request);
    }
}
