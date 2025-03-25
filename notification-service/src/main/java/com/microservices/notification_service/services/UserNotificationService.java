package com.microservices.notification_service.services;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.microservices.notification_service.dao.NotificationDao;
import com.microservices.notification_service.models.Notification;
import com.microservices.notification_service.models.request.GetCurrentUserNotificationsRequest;
import com.microservices.notification_service.models.request.GetUserNotificationsRequest;
import com.microservices.notification_service.models.response.GetCurrentUserNotificationsResponse;
import com.microservices.notification_service.models.response.GetUserNotificationsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

import static java.util.Collections.singletonMap;

@Service
@RequiredArgsConstructor
public class UserNotificationService {

    private final NotificationDao notificationDao;

    public Map<String, String> getUserNotifications(GetUserNotificationsRequest request) throws JsonProcessingException {
        GetUserNotificationsResponse response = GetUserNotificationsResponse.builder().build();

        List<Notification> userNotifications = notificationDao.getUserNotifications(request.getUserId());
        if (userNotifications.isEmpty()) {
            response.setError("No notifications found for this user");
            return singletonMap("warning", convertObjectToJsonString(response));
        }

        response.setNotifications(userNotifications);

        return singletonMap("notifications", convertObjectToJsonString(response));
    }

    public Map<String, String> getCurrentUserNotifications(GetCurrentUserNotificationsRequest request) throws JsonProcessingException {
        GetCurrentUserNotificationsResponse response = GetCurrentUserNotificationsResponse.builder().build();

        List<Notification> userNotifications = notificationDao.getUserNotifications(request.getUserId());
        if (userNotifications.isEmpty()) {
            response.setError("No notifications found");
            return singletonMap("warning", convertObjectToJsonString(response));
        }

        response.setNotifications(userNotifications);

        return singletonMap("notifications", convertObjectToJsonString(response));
    }

    private String convertObjectToJsonString(Object object) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();

        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectMapper.registerModule(new JavaTimeModule());

        return objectMapper.writeValueAsString(object);
    }

}
