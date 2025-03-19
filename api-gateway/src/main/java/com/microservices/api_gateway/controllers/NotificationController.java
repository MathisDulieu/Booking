package com.microservices.api_gateway.controllers;

import com.microservices.api_gateway.services.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/private/admin/notifications/user/{userId}")
    @Operation(tags = {"Notification"}, summary = "Récupérer les notifications d'un utilisateur par son id")
    public ResponseEntity<Map<String, String>> getUserNotifications() {
        return notificationService.getUserNotifications();
    }

    @GetMapping("/private/notifications")
    @Operation(tags = {"Notification"}, summary = "Récupérer les notifications de l'utilisateur connecté")
    public ResponseEntity<Map<String, String>> getCurrentUserNotifications() {
        return notificationService.getCurrentUserNotifications();
    }

    @PutMapping("/private/notifications/preferences")
    @Operation(tags = {"Notification"}, summary = "Modifier les préférences de notifications")
    public ResponseEntity<Map<String, String>> updateNotificationPreferences() {
        return notificationService.updateNotificationPreferences();
    }

    @PostMapping("/private/admin/notifications/send")
    @Operation(tags = {"Notification"}, summary = "Envoyer une notification aux utilisateurs")
    public ResponseEntity<Map<String, String>> sendNotification() {
        return notificationService.sendNotification();
    }
}
