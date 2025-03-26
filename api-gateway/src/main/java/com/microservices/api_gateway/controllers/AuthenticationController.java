package com.microservices.api_gateway.controllers;

import com.microservices.api_gateway.models.dto.request.authentication.*;
import com.microservices.api_gateway.services.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.SchemaProperty;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/auth/login")
    @Operation(
            tags = {"Authentication"},
            summary = "Login to the system",
            description = "Authenticates a user and returns a JWT token that can be used for subsequent API calls. " +
                    "The token will be valid for a limited time and should be included in the Authorization header " +
                    "for protected endpoints."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successful authentication",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"authToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Bad request - Invalid input parameters",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "invalidFormat",
                                            summary = "Invalid format",
                                            value = "{\"BAD_REQUEST\": \"Email format is invalid\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - Invalid password",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "invalidPassword",
                                            summary = "Invalid password",
                                            value = "{\"UNAUTHORIZED\": \"Invalid password\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden - Email not verified",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "notVerified",
                                            summary = "Email not verified",
                                            value = "{\"FORBIDDEN\": \"Email is not verified\"}"
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
                                            summary = "Authentication service error",
                                            value = "{\"error\": \"Error communicating with authentication service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from authentication service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, String>> login(
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Login credentials",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = LoginRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "validUser",
                                            summary = "Valid user login",
                                            value = "{\"email\": \"user@example.com\", \"password\": \"Password123!\"}"
                                    )
                            }
                    )
            )
            LoginRequest request
    ) {
        return authenticationService.login(request);
    }

    @PostMapping("/auth/register")
    @Operation(tags = {"Authentication"}, summary = "Register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        return authenticationService.register(request);
    }

    @PostMapping("/auth/validate-email")
    @Operation(tags = {"Authentication"}, summary = "Valider l'email")
    public ResponseEntity<Map<String, String>> validateEmail(@RequestBody ValidateEmailRequest request) {
        return authenticationService.validateEmail(request);
    }

    @PostMapping("/private/auth/validate-phone")
    @Operation(tags = {"Authentication"}, summary = "Valider le numéro de téléphone")
    public ResponseEntity<Map<String, String>> validatePhone(@RequestBody ValidatePhoneRequest request) {
        return authenticationService.validatePhone(request);
    }

    @PostMapping("/auth/resend-email-validation")
    @Operation(tags = {"Authentication"}, summary = "Renvoyer un email de validation")
    public ResponseEntity<Map<String, String>> resendEmailValidation(@RequestBody ResendEmailValidationRequest request) {
        return authenticationService.resendEmailValidation(request);
    }

    @PostMapping("/private/auth/send-phone-code")
    @Operation(tags = {"Authentication"}, summary = "Envoyer un code pour valider le numéro de téléphone")
    public ResponseEntity<Map<String, String>> sendPhoneValidationCode() {
        return authenticationService.sendPhoneValidationCode();
    }

}
