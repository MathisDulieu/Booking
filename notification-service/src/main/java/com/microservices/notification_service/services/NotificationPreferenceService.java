package com.microservices.notification_service.services;

import com.microservices.notification_service.dao.UserDao;
import com.microservices.notification_service.models.User;
import com.microservices.notification_service.models.request.UpdateNotificationPreferencesRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

import static java.util.Collections.singletonMap;

@Service
@RequiredArgsConstructor
public class NotificationPreferenceService {

    private final UserDao userDao;

    public Map<String, String> updateNotificationPreferences(UpdateNotificationPreferencesRequest request) {
        Optional<User> user = userDao.findById(request.getUserId());
        if (user.isEmpty()) {
            return singletonMap("NOT_FOUND", "User not found");
        }

        user.get().getNotificationPreferences().setSms(request.isSms());
        user.get().getNotificationPreferences().setEmail(request.isEmail());

        userDao.save(user.get());

        return singletonMap("message", "Notification preferences updated successfully");
    }

}
