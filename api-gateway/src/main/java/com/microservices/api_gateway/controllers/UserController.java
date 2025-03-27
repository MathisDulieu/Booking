package com.microservices.api_gateway.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.microservices.api_gateway.models.User;
import com.microservices.api_gateway.models.dto.request.user.*;
import com.microservices.api_gateway.models.dto.response.user.GetCurrentUserInfoResponse;
import com.microservices.api_gateway.models.dto.response.user.GetUserByIdResponse;
import com.microservices.api_gateway.services.UserService;
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
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/private/user")
    @Operation(
            tags = {"User"},
            summary = "Get current user information",
            description = "Retrieves information about the currently authenticated user. " +
                    "This endpoint returns user details such as username, email, phone number, role, " +
                    "and verification status of email and phone number.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved user information",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "userResponse",
                                            summary = "User information",
                                            value = "{\"informations\": {\"username\":\"user123\",\"email\":\"user@example.com\",\"phoneNumber\":\"+33123456789\",\"role\":\"USER\",\"isValidatedEmail\":true,\"isValidatedPhoneNumber\":false}}"
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
                                            summary = "User service error",
                                            value = "{\"error\": \"Error communicating with the user service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the user service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, GetCurrentUserInfoResponse>> getCurrentUser(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User authenticatedUser
    ) throws JsonProcessingException {
        return userService.getCurrentUserInfo(authenticatedUser);
    }

    @DeleteMapping("/private/user")
    @Operation(
            tags = {"User"},
            summary = "Delete current user account",
            description = "Permanently deletes the currently authenticated user's account. " +
                    "This action cannot be undone and will remove all user data from the system. " +
                    "Associated data such as tickets, payments, and notifications will also be affected.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "User account successfully deleted",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"User deleted successfully\"}"
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
                                            summary = "User service error",
                                            value = "{\"error\": \"Error communicating with the user service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the user service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, String>> deleteAccount(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return userService.deleteCurrentUser(authenticatedUser);
    }

    @PutMapping("/private/user/username")
    @Operation(
            tags = {"User"},
            summary = "Update username",
            description = "Updates the username of the currently authenticated user. " +
                    "The new username must meet validation criteria: be between 3 and 11 characters, " +
                    "contain no spaces, and not already be in use by another user. " +
                    "The new username also cannot be the same as the current username.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Username successfully updated",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"Username updated successfully\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Bad request - Invalid username",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "invalidFormat",
                                            summary = "Invalid username format",
                                            value = "{\"BAD_REQUEST\": \"Invalid username: Must be 3-11 characters and cannot contain spaces.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "alreadyTaken",
                                            summary = "Username already taken",
                                            value = "{\"BAD_REQUEST\": \"Username already taken: Please choose a different one.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "sameAsCurrent",
                                            summary = "Same as current username",
                                            value = "{\"BAD_REQUEST\": \"Username cannot be the same as the current one.\"}"
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
                                            summary = "User service error",
                                            value = "{\"error\": \"Error communicating with the user service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the user service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, String>> updateUsername(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User authenticatedUser,

            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "New username details",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = UpdateUsernameRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "usernameUpdate",
                                            summary = "Username update example",
                                            value = "{\"username\": \"newuser123\"}"
                                    )
                            }
                    )
            )
            UpdateUsernameRequest request
    ) {
        return userService.updateUsername(request, authenticatedUser);
    }

    @PutMapping("/private/user/email")
    @Operation(
            tags = {"User"},
            summary = "Update email address",
            description = "Updates the email address of the currently authenticated user. " +
                    "The new email must be in a valid format, not already be registered by another user, " +
                    "and must be different from the current email address. " +
                    "After updating, the user will need to verify the new email address.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Email successfully updated",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"Email updated successfully\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Bad request - Invalid email",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "invalidFormat",
                                            summary = "Invalid email format",
                                            value = "{\"BAD_REQUEST\": \"Invalid email format.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "alreadyUsed",
                                            summary = "Email already used",
                                            value = "{\"BAD_REQUEST\": \"This email is already used.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "sameAsCurrent",
                                            summary = "Same as current email",
                                            value = "{\"BAD_REQUEST\": \"The new email address must be different from the current one.\"}"
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
                                            summary = "User service error",
                                            value = "{\"error\": \"Error communicating with the user service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the user service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, String>> updateEmail(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User authenticatedUser,

            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "New email details",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = UpdateEmailRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "emailUpdate",
                                            summary = "Email update example",
                                            value = "{\"email\": \"newemail@example.com\"}"
                                    )
                            }
                    )
            )
            UpdateEmailRequest request
    ) {
        return userService.updateEmail(request, authenticatedUser);
    }

    @PutMapping("/private/user/phone")
    @Operation(
            tags = {"User"},
            summary = "Update phone number",
            description = "Updates the phone number of the currently authenticated user. " +
                    "The new phone number must be in a valid format and not already be registered by another user. " +
                    "A valid phone number format follows the French standard (+33XXXXXXXXX or 0XXXXXXXXX).",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Phone number successfully updated",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"PhoneNumber updated successfully\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Bad request - Invalid phone number",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "invalidFormat",
                                            summary = "Invalid phone number format",
                                            value = "{\"BAD_REQUEST\": \"Invalid phone number format.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "alreadyUsed",
                                            summary = "Phone number already used",
                                            value = "{\"BAD_REQUEST\": \"This phone number is already used.\"}"
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
                                            summary = "User service error",
                                            value = "{\"error\": \"Error communicating with the user service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the user service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, String>> updatePhone(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User authenticatedUser,

            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "New phone number details",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = UpdatePhoneRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "phoneUpdate",
                                            summary = "Phone update example",
                                            value = "{\"phone\": \"+33612345678\"}"
                                    )
                            }
                    )
            )
            UpdatePhoneRequest request
    ) {
        return userService.updatePhone(request, authenticatedUser);
    }

    @PutMapping("/private/user/password")
    @Operation(
            tags = {"User"},
            summary = "Update password",
            description = "Updates the password of the currently authenticated user. " +
                    "The user must provide their current password for verification, and the new password " +
                    "must meet security requirements (at least 8 characters, including uppercase, lowercase, " +
                    "numbers, and special characters). The new password cannot be the same as the current password.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Password successfully updated",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"Password updated successfully\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Bad request - Invalid password",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "nullPassword",
                                            summary = "Null password",
                                            value = "{\"BAD_REQUEST\": \"Old password and new password cannot be null!\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidFormat",
                                            summary = "Invalid password format",
                                            value = "{\"BAD_REQUEST\": \"The new password does not meet the required criteria.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "samePassword",
                                            summary = "Same as old password",
                                            value = "{\"BAD_REQUEST\": \"New password must be different from the old password.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "incorrectOldPassword",
                                            summary = "Incorrect old password",
                                            value = "{\"BAD_REQUEST\": \"Old password is incorrect.\"}"
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
                                            summary = "User service error",
                                            value = "{\"error\": \"Error communicating with the user service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the user service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, String>> updatePassword(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User authenticatedUser,

            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Password update details",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = UpdatePasswordRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "passwordUpdate",
                                            summary = "Password update example",
                                            value = """
                                                    {
                                                      "oldPassword": "CurrentPassword123!",
                                                      "newPassword": "NewSecurePassword456@"
                                                    }"""
                                    )
                            }
                    )
            )
            UpdatePasswordRequest request
    ) {
        return userService.updatePassword(request, authenticatedUser);
    }

    @GetMapping("/private/admin/user/{id}")
    @Operation(
            tags = {"User"},
            summary = "Get user by ID",
            description = "Retrieves detailed information about a user by their unique identifier. " +
                    "This endpoint is accessible only to administrators. Admin users cannot be retrieved " +
                    "through this endpoint for security reasons.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved user information",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "userResponse",
                                            summary = "User information",
                                            value = "{\"informations\": {\"id\":\"12345\",\"username\":\"user123\",\"email\":\"user@example.com\",\"phoneNumber\":\"+33123456789\",\"role\":\"USER\",\"isValidatedEmail\":true,\"isValidatedPhoneNumber\":false}}"
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
                    description = "Forbidden - Admin access required or admin user requested",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "adminRequired",
                                            summary = "Admin access required",
                                            value = "{\"FORBIDDEN\": \"This endpoint is restricted to administrators\"}"
                                    ),
                                    @ExampleObject(
                                            name = "adminRequested",
                                            summary = "Admin user requested",
                                            value = "{\"FORBIDDEN\": {\"error\":\"Admin users cannot be retrieved\"}}"
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
                                            value = "{\"NOT_FOUND\": {\"error\":\"User not found\"}}"
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
                                            summary = "User service error",
                                            value = "{\"error\": \"Error communicating with the user service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the user service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, GetUserByIdResponse>> getUserById(
            @Parameter(
                    description = "ID of the user to retrieve",
                    required = true,
                    example = "12345",
                    schema = @Schema(type = "string")
            )
            @PathVariable("id") String userId
    ) throws JsonProcessingException {
        return userService.getUserById(userId);
    }

    @PutMapping("/private/admin/user")
    @Operation(
            tags = {"User"},
            summary = "Update user by ID",
            description = "Allows administrators to update user information. At least one field " +
                    "(email, username, phoneNumber, or role) must be provided. Each field is validated " +
                    "before the update is applied. New values must be different from the current ones and " +
                    "must meet the validation criteria for each field.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "User successfully updated",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"User with id: 12345 updated successfully\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Bad request - Validation errors",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "noFieldsProvided",
                                            summary = "No fields provided",
                                            value = "{\"BAD_REQUEST\": \"No values provided for update. Please specify at least one field (email, username, phoneNumber or role)\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidUsername",
                                            summary = "Invalid username",
                                            value = "{\"BAD_REQUEST\": \"Invalid username: Must be 3-11 characters and cannot contain spaces.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "usernameTaken",
                                            summary = "Username already taken",
                                            value = "{\"BAD_REQUEST\": \"Username already taken: Please choose a different one.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "sameUsername",
                                            summary = "Same username",
                                            value = "{\"BAD_REQUEST\": \"Username cannot be the same as the current one.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidEmail",
                                            summary = "Invalid email",
                                            value = "{\"BAD_REQUEST\": \"Invalid email format.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "emailTaken",
                                            summary = "Email already taken",
                                            value = "{\"BAD_REQUEST\": \"This email is already used.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "sameEmail",
                                            summary = "Same email",
                                            value = "{\"BAD_REQUEST\": \"The new email address must be different from the current one.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidRole",
                                            summary = "Invalid role",
                                            value = "{\"BAD_REQUEST\": \"Invalid role: INVALID_ROLE. Allowed values are: [USER, ADMIN, ARTIST]\"}"
                                    ),
                                    @ExampleObject(
                                            name = "sameRole",
                                            summary = "Same role",
                                            value = "{\"BAD_REQUEST\": \"The new role must be different from the current one\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidPhone",
                                            summary = "Invalid phone number",
                                            value = "{\"BAD_REQUEST\": \"Invalid phone number format.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "phoneTaken",
                                            summary = "Phone number already taken",
                                            value = "{\"BAD_REQUEST\": \"This phone number is already used.\"}"
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
                    description = "Forbidden - Admin access required",
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
                                            summary = "User service error",
                                            value = "{\"error\": \"Error communicating with the user service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the user service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, String>> updateUser(
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "User update details",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = UpdateUserRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "userUpdate",
                                            summary = "User update example",
                                            value = """
                                                    {
                                                      "userId": "12345",
                                                      "username": "newusername",
                                                      "email": "newemail@example.com",
                                                      "phoneNumber": "+33612345678",
                                                      "role": "ARTIST"
                                                    }"""
                                    )
                            }
                    )
            )
            UpdateUserRequest request
    ) {
        return userService.updateUser(request);
    }

    @PostMapping("/private/admin/user")
    @Operation(
            tags = {"User"},
            summary = "Create a new user",
            description = "Allows administrators to create a new user in the system. " +
                    "All user information must be provided and validated, including username, email, " +
                    "phone number, password, and role. The username, email, and phone number must be unique. " +
                    "This endpoint is restricted to administrators.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "User successfully created",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"User created successfully\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Bad request - Validation errors",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "invalidRole",
                                            summary = "Invalid role",
                                            value = "{\"BAD_REQUEST\": \"Invalid role: INVALID_ROLE. Allowed values are: [USER, ADMIN, ARTIST]\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidUsername",
                                            summary = "Invalid username",
                                            value = "{\"BAD_REQUEST\": \"Invalid username: Must be 3-11 characters and cannot contain spaces.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "usernameTaken",
                                            summary = "Username already taken",
                                            value = "{\"BAD_REQUEST\": \"Username already taken: Please choose a different one.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidEmail",
                                            summary = "Invalid email",
                                            value = "{\"BAD_REQUEST\": \"Invalid email format.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "emailTaken",
                                            summary = "Email already taken",
                                            value = "{\"BAD_REQUEST\": \"This email is already used.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidPhone",
                                            summary = "Invalid phone number",
                                            value = "{\"BAD_REQUEST\": \"Invalid phone number format.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "phoneTaken",
                                            summary = "Phone number already taken",
                                            value = "{\"BAD_REQUEST\": \"This phone number is already used.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidPassword",
                                            summary = "Invalid password",
                                            value = "{\"BAD_REQUEST\": \"The password does not meet the required criteria.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "multipleErrors",
                                            summary = "Multiple validation errors",
                                            value = "{\"BAD_REQUEST\": \"Invalid username: Must be 3-11 characters and cannot contain spaces., Invalid email format.\"}"
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
                    description = "Forbidden - Admin access required",
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
                                            summary = "User service error",
                                            value = "{\"error\": \"Error communicating with the user service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the user service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, String>> createUser(
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "User creation details",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = CreateUserRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "userCreate",
                                            summary = "User creation example",
                                            value = """
                                                    {
                                                      "username": "newuser123",
                                                      "email": "user@example.com",
                                                      "phoneNumber": "+33612345678",
                                                      "password": "SecurePassword123!",
                                                      "role": "USER"
                                                    }"""
                                    )
                            }
                    )
            )
            CreateUserRequest request
    ) {
        return userService.createUser(request);
    }

}
