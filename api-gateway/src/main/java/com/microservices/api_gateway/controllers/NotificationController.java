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
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.ErrorResponse;
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
            summary = "Get notifications for a specific user",
            description = "Retrieves all notifications for a specified user by their ID. " +
                    "This endpoint is accessible only to administrators and returns all notifications " +
                    "associated with the requested user, sorted by date.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved notifications",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "notificationsResponse",
                                            summary = "Notifications list",
                                            value = "{\"notifications\": {\"notifications\":[{\"id\":\"1\",\"userId\":\"12345\",\"message\":\"Your event has been created\",\"timestamp\":\"2025-03-25T14:30:00\",\"read\":false},{\"id\":\"2\",\"userId\":\"12345\",\"message\":\"New ticket purchased\",\"timestamp\":\"2025-03-26T09:15:00\",\"read\":true}]}}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "200",
                    description = "Warning - No notifications found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GetUserNotificationsResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "noNotificationsFound",
                                            summary = "No notifications for user",
                                            value = "{\"warning\": {\"error\":\"No notifications found for this user\"}}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Bad request - Invalid user ID",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "invalidUserId",
                                            summary = "Invalid user ID format",
                                            value = "{\"BAD_REQUEST\": \"Invalid user ID format\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - Authentication required",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "unauthorized",
                                            summary = "Authentication required",
                                            value = "{\"UNAUTHORIZED\": \"Authentication required to access this resource\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden - Insufficient permissions",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "forbidden",
                                            summary = "Admin access required",
                                            value = "{\"FORBIDDEN\": \"This endpoint is restricted to administrators\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "serviceError",
                                            summary = "Notification service error",
                                            value = "{\"error\": \"Error communicating with the notification service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the notification service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, GetUserNotificationsResponse>> getUserNotifications(
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "User ID for notifications retrieval",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = GetUserNotificationsRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "requestExample",
                                            summary = "User notifications request",
                                            value = "{\"userId\": \"12345\"}"
                                    )
                            }
                    )
            )
            GetUserNotificationsRequest request
    ) throws JsonProcessingException {
        return notificationService.getUserNotifications(request);
    }

    @GetMapping("/notifications")
    @Operation(
            tags = {"Notification"},
            summary = "Get notifications for the authenticated user",
            description = "Retrieves all notifications for the currently authenticated user. " +
                    "This endpoint returns all notifications associated with the current user's account, " +
                    "allowing them to view their messages, event updates, and system notifications.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved notifications",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "notificationsResponse",
                                            summary = "User notifications",
                                            value = "{\"notifications\": {\"notifications\":[{\"id\":\"1\",\"userId\":\"12345\",\"message\":\"Your event has been created\",\"timestamp\":\"2025-03-25T14:30:00\",\"read\":false},{\"id\":\"2\",\"userId\":\"12345\",\"message\":\"New ticket purchased\",\"timestamp\":\"2025-03-26T09:15:00\",\"read\":true}]}}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "200",
                    description = "Warning - No notifications found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GetCurrentUserNotificationsResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "noNotificationsFound",
                                            summary = "No notifications",
                                            value = "{\"warning\": {\"error\":\"No notifications found\"}}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - Authentication required",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "unauthorized",
                                            summary = "Authentication required",
                                            value = "{\"UNAUTHORIZED\": \"Authentication required to access this resource\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "serviceError",
                                            summary = "Notification service error",
                                            value = "{\"error\": \"Error communicating with the notification service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the notification service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, GetCurrentUserNotificationsResponse>> getCurrentUserNotifications(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User authenticatedUser
    ) throws JsonProcessingException {
        return notificationService.getCurrentUserNotifications(authenticatedUser);
    }

    @PutMapping("/notifications/preferences")
    @Operation(
            tags = {"Notification"},
            summary = "Update notification preferences",
            description = "Updates the notification preferences for the currently authenticated user. " +
                    "This endpoint allows users to customize how they receive notifications, " +
                    "such as enabling or disabling email and SMS notifications.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Preferences updated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"Notification preferences updated successfully\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Bad request - Invalid preferences",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "invalidPreferences",
                                            summary = "Invalid preferences format",
                                            value = "{\"BAD_REQUEST\": \"Invalid notification preferences format\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - Authentication required",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "unauthorized",
                                            summary = "Authentication required",
                                            value = "{\"UNAUTHORIZED\": \"Authentication required to access this resource\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Not found - User not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "userNotFound",
                                            summary = "User not found",
                                            value = "{\"NOT_FOUND\": \"User not found\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "serviceError",
                                            summary = "Notification service error",
                                            value = "{\"error\": \"Error communicating with the notification service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the notification service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, String>> updateNotificationPreferences(
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Notification preferences",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = UpdateNotificationPreferencesRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "preferencesExample",
                                            summary = "Notification preferences update",
                                            value = "{\"email\": true, \"sms\": false}"
                                    )
                            }
                    )
            )
            UpdateNotificationPreferencesRequest request,

            @Parameter(hidden = true)
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return notificationService.updateNotificationPreferences(request, authenticatedUser);
    }

    @PostMapping("/admin/notifications/send")
    @Operation(
            tags = {"Notification"},
            summary = "Send notification to a user",
            description = "Allows administrators to send a custom notification to a specific user. " +
                    "The notification can be delivered via email, SMS, or both, depending on the user's preferences. " +
                    "This endpoint validates that the notification type is valid and that the user has accepted the " +
                    "specified notification method.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Notification sent successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"Notification sent successfully\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Bad request - Invalid parameters",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "noMethodSpecified",
                                            summary = "No notification method specified",
                                            value = "{\"BAD_REQUEST\": \"At least one sent method is required\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidType",
                                            summary = "Invalid notification type",
                                            value = "{\"BAD_REQUEST\": \"Invalid notification type\"}"
                                    ),
                                    @ExampleObject(
                                            name = "notAccepted",
                                            summary = "User has not accepted notification method",
                                            value = "{\"BAD_REQUEST\": \"User has not accepted this notification method\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - Authentication required",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "unauthorized",
                                            summary = "Authentication required",
                                            value = "{\"UNAUTHORIZED\": \"Authentication required to access this resource\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden - Insufficient permissions",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "forbidden",
                                            summary = "Admin access required",
                                            value = "{\"FORBIDDEN\": \"This endpoint is restricted to administrators\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Not found - User not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "userNotFound",
                                            summary = "User not found",
                                            value = "{\"NOT_FOUND\": \"User not found\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "serviceError",
                                            summary = "Notification service error",
                                            value = "{\"error\": \"Error communicating with the notification service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the notification service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, String>> sendNotification(
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Notification details",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = SendNotificationRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "notificationExample",
                                            summary = "Send notification to user",
                                            value = """
                                                    {
                                                      "userId": "12345",
                                                      "message": "Your ticket has been confirmed for the upcoming event",
                                                      "type": "EVENT_UPDATE",
                                                      "sentByEmail": true,
                                                      "sentBySMS": false
                                                    }"""
                                    )
                            }
                    )
            )
            SendNotificationRequest request
    ) {
        return notificationService.sendNotification(request);
    }
}
