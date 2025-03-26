package com.microservices.api_gateway.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.microservices.api_gateway.models.User;
import com.microservices.api_gateway.models.dto.request.notification.GetUserNotificationsRequest;
import com.microservices.api_gateway.models.dto.request.notification.SendNotificationRequest;
import com.microservices.api_gateway.models.dto.request.notification.UpdateNotificationPreferencesRequest;
import com.microservices.api_gateway.models.dto.response.notification.GetCurrentUserNotificationsResponse;
import com.microservices.api_gateway.models.dto.response.notification.GetUserNotificationsResponse;
import com.microservices.api_gateway.services.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/private")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/admin/notifications/user")
    @Operation(
            tags = {"Notification"},
            summary = "Récupérer les notifications d'un utilisateur par son id",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, GetUserNotificationsResponse>> getUserNotifications(
            @RequestBody GetUserNotificationsRequest request
    ) throws JsonProcessingException {
        return notificationService.getUserNotifications(request);
    }

    @GetMapping("/notifications")
    @Operation(
            tags = {"Notification"},
            summary = "Récupérer les notifications de l'utilisateur connecté",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, GetCurrentUserNotificationsResponse>> getCurrentUserNotifications(
            @AuthenticationPrincipal User authenticatedUser
    ) throws JsonProcessingException {
        return notificationService.getCurrentUserNotifications(authenticatedUser);
    }

    @PutMapping("/notifications/preferences")
    @Operation(
            tags = {"Notification"},
            summary = "Modifier les préférences de notifications",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, String>> updateNotificationPreferences(
            @RequestBody UpdateNotificationPreferencesRequest request,
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return notificationService.updateNotificationPreferences(request, authenticatedUser);
    }

    @PostMapping("/admin/notifications/send")
    @Operation(
            tags = {"Notification"},
            summary = "Envoyer une notification à un utilisateur",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, String>> sendNotification(
            @RequestBody SendNotificationRequest request
    ) {
        return notificationService.sendNotification(request);
    }
}
