package com.microservices.api_gateway.services;

import com.microservices.api_gateway.configurations.EnvConfiguration;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final EnvConfiguration envConfiguration;

    public ResponseEntity<Map<String, String>> getUserNotifications() {
        return null;
    }

    public ResponseEntity<Map<String, String>> getCurrentUserNotifications() {
        return null;
    }

    public ResponseEntity<Map<String, String>> updateNotificationPreferences() {
        return null;
    }

    public ResponseEntity<Map<String, String>> sendNotification() {
        return null;
    }
}
