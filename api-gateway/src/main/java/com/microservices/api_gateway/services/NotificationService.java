package com.microservices.api_gateway.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservices.api_gateway.Producer;
import com.microservices.api_gateway.configurations.EnvConfiguration;
import com.microservices.api_gateway.models.User;
import com.microservices.api_gateway.models.dto.request.notification.GetCurrentUserNotificationsRequest;
import com.microservices.api_gateway.models.dto.request.notification.GetUserNotificationsRequest;
import com.microservices.api_gateway.models.dto.request.notification.SendNotificationRequest;
import com.microservices.api_gateway.models.dto.request.notification.UpdateNotificationPreferencesRequest;
import com.microservices.api_gateway.models.dto.request.payment.PayWithCardRequest;
import com.microservices.api_gateway.models.dto.request.payment.PayWithPaypalRequest;
import com.microservices.api_gateway.models.dto.response.notification.GetCurrentUserNotificationsResponse;
import com.microservices.api_gateway.models.dto.response.notification.GetUserNotificationsResponse;
import com.microservices.api_gateway.models.dto.response.user.GetUserByIdResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

import static java.util.Collections.singletonMap;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final Producer producer;
    private final ErrorResponseService errorResponseService;

    private <T> ResponseEntity<Map<String, String>> sendNotificationRequest(String routingKey, T request) {
        try {
            Map<String, String> response = producer.sendAndReceive(
                    "notification-exchange",
                    routingKey,
                    request,
                    Map.class
            );

            if (response == null) {
                return ResponseEntity.internalServerError()
                        .body(Map.of("error", "Aucune réponse reçue du service de notification"));
            }

            return errorResponseService.mapToResponseEntity(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Erreur lors de la communication avec le service de notification : " + e.getMessage()));
        }
    }

    public <T, R> ResponseEntity<Map<String, R>> sendAndProcessNotificationRequest(String endpoint, T request, Class<R> responseClass) throws JsonProcessingException {
        ResponseEntity<Map<String, String>> response = sendNotificationRequest(endpoint, request);
        HttpStatusCode status = response.getStatusCode();
        Map<String, String> responseBody = response.getBody();
        String key = responseBody.keySet().iterator().next();
        String jsonValue = responseBody.get(key);
        ObjectMapper objectMapper = new ObjectMapper();
        R userResponse = objectMapper.readValue(jsonValue, responseClass);
        Map<String, R> result = singletonMap(key, userResponse);
        return ResponseEntity.status(status).body(result);
    }

    public ResponseEntity<Map<String, GetUserNotificationsResponse>> getUserNotifications(GetUserNotificationsRequest request) throws JsonProcessingException {
        return sendAndProcessNotificationRequest("notification.getUserNotifications", request, GetUserNotificationsResponse.class);
    }

    public ResponseEntity<Map<String, GetCurrentUserNotificationsResponse>> getCurrentUserNotifications(User authenticatedUser) throws JsonProcessingException {
        GetCurrentUserNotificationsRequest request = new GetCurrentUserNotificationsRequest(authenticatedUser.getId());
        return sendAndProcessNotificationRequest("notification.getCurrentUserNotifications", request, GetCurrentUserNotificationsResponse.class);
    }

    public ResponseEntity<Map<String, String>> updateNotificationPreferences(UpdateNotificationPreferencesRequest request, User authenticatedUser) {
        request.setUserId(authenticatedUser.getId());
        return sendNotificationRequest("notification.updateNotificationPreferences", request);
    }

    public ResponseEntity<Map<String, String>> sendNotification(SendNotificationRequest request) {
        return sendNotificationRequest("notification.sendNotification", request);
    }
}
