package com.microservices.notification_service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservices.notification_service.models.request.GetCurrentUserNotificationsRequest;
import com.microservices.notification_service.models.request.GetUserNotificationsRequest;
import com.microservices.notification_service.models.request.SendNotificationRequest;
import com.microservices.notification_service.models.request.UpdateNotificationPreferencesRequest;
import com.microservices.notification_service.services.NotificationPreferenceService;
import com.microservices.notification_service.services.NotificationSenderService;
import com.microservices.notification_service.services.UserNotificationService;
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

    private final UserNotificationService userNotificationService;
    private final NotificationPreferenceService notificationPreferenceService;
    private final NotificationSenderService notificationSenderService;
    private final ObjectMapper objectMapper;

    @RabbitListener(
            bindings = @QueueBinding(
                    value = @Queue(value = "notification.queue", durable = "true"),
                    exchange = @Exchange(value = "notification-exchange", type = ExchangeTypes.TOPIC),
                    key = "notification.*"
            )
    )
    public String handleAuthRequest(String payload, Message message) {
        String routingKey = message.getMessageProperties().getReceivedRoutingKey();

        try {
            Map<String, String> result = switch (routingKey) {
                case "notification.getUserNotifications" -> {
                    GetUserNotificationsRequest getUserNotificationsRequest = objectMapper.readValue(payload, GetUserNotificationsRequest.class);
                    yield userNotificationService.getUserNotifications(getUserNotificationsRequest);
                }
                case "notification.getCurrentUserNotifications" -> {
                    GetCurrentUserNotificationsRequest getCurrentUserNotificationsRequest = objectMapper.readValue(payload, GetCurrentUserNotificationsRequest.class);
                    yield userNotificationService.getCurrentUserNotifications(getCurrentUserNotificationsRequest);
                }
                case "notification.updateNotificationPreferences" -> {
                    UpdateNotificationPreferencesRequest updateNotificationPreferencesRequest = objectMapper.readValue(payload, UpdateNotificationPreferencesRequest.class);
                    yield notificationPreferenceService.updateNotificationPreferences(updateNotificationPreferencesRequest);
                }
                case "notification.sendNotification" -> {
                    SendNotificationRequest sendNotificationRequest = objectMapper.readValue(payload, SendNotificationRequest.class);
                    yield notificationSenderService.sendNotification(sendNotificationRequest);
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
