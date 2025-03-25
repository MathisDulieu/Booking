package com.microservices.notification_service.services;

import com.microservices.notification_service.UuidProvider;
import com.microservices.notification_service.dao.NotificationDao;
import com.microservices.notification_service.dao.UserDao;
import com.microservices.notification_service.models.Notification;
import com.microservices.notification_service.models.NotificationType;
import com.microservices.notification_service.models.User;
import com.microservices.notification_service.models.request.SendNotificationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

import static java.util.Collections.singletonMap;
import static java.util.Objects.isNull;
import static org.apache.commons.lang3.BooleanUtils.isFalse;

@Service
@RequiredArgsConstructor
public class NotificationSenderService {

    private final UuidProvider uuidProvider;
    private final NotificationDao notificationDao;
    private final UserDao userDao;

    public Map<String, String> sendNotification(SendNotificationRequest request) {
        if (isFalse(request.isSentBySMS()) && isFalse(request.isSentByEmail())) {
            return singletonMap("BAD_REQUEST", "At least one sent method is required");
        }

        NotificationType notificationType = getValidNotificationType(request.getType());

        Optional<User> user = userDao.findById(request.getUserId());
        if (user.isEmpty()) {
            return singletonMap("NOT_FOUND", "User not found");
        }

        if (isNull(notificationType)) {
            return singletonMap("BAD_REQUEST", "Invalid notification type");
        }

        if (notificationDao.isNotAcceptedSent(request.isSentByEmail(), request.isSentBySMS(), user.get().getNotificationPreferences())) {
            return singletonMap("BAD_REQUEST", "User has not accepted this notification method");
        }

        Notification notification = buildNotification(request, notificationType);
        notificationDao.save(notification);

        return singletonMap("message", "Notification sent successfully");
    }

    private NotificationType getValidNotificationType(String type) {
        try {
            return NotificationType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private Notification buildNotification(SendNotificationRequest request, NotificationType notificationType) {
        return Notification.builder()
                .id(uuidProvider.generateUuid())
                .userId(request.getUserId())
                .subject(request.getSubject())
                .type(notificationType)
                .isSentBySMS(request.isSentBySMS())
                .isSentByEmail(request.isSentByEmail())
                .build();
    }

}
