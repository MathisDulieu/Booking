package com.microservices.api_gateway.controller;

import com.microservices.api_gateway.services.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/email")
    @Operation(tags = {"Notification"})
    public ResponseEntity<Map<String, String>> sendConfirmationEmail() {
        return notificationService.sendConfirmationEmail();
    }

    @PostMapping("/sms")
    @Operation(tags = {"Notification"})
    public ResponseEntity<Map<String, String>> sendConfirmationSMS() {
        return notificationService.sendConfirmationSMS();
    }
}
