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
    @Operation(
            tags = {"Authentication"},
            summary = "Register a new user",
            description = "Registers a new user in the system and sends a confirmation email. " +
                    "The user must verify their email address by clicking on the confirmation link " +
                    "sent to their email before they can log in. The API validates the provided information " +
                    "such as email format, username length, password strength, and phone number format."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successful registration",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"User successfully registered!\"}"
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
                                            name = "invalidEmail",
                                            summary = "Invalid email format",
                                            value = "{\"BAD_REQUEST\": \"The provided email is not valid.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidUsername",
                                            summary = "Invalid username",
                                            value = "{\"BAD_REQUEST\": \"The username must be between 3 and 11 characters long and must not contain spaces.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidPassword",
                                            summary = "Invalid password",
                                            value = "{\"BAD_REQUEST\": \"The password does not meet the required criteria.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "emailAlreadyExists",
                                            summary = "Email already in use",
                                            value = "{\"BAD_REQUEST\": \"A user with this email already exists.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "usernameAlreadyExists",
                                            summary = "Username already in use",
                                            value = "{\"BAD_REQUEST\": \"A user with this username already exists.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidPhoneNumber",
                                            summary = "Invalid phone number",
                                            value = "{\"BAD_REQUEST\": \"The phone number is not a valid phone number.\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "200",
                    description = "Registration successful but warning with email",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "emailWarning",
                                            summary = "Email send failure warning",
                                            value = "{\"warning\": \"Failed to send the registration confirmation email. Please try again later.\"}"
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
    public ResponseEntity<Map<String, String>> register(
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Registration details",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = RegisterRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "validRegistration",
                                            summary = "Valid user registration",
                                            value = "{\"email\": \"user@example.com\", \"password\": \"Password123!\", \"username\": \"user123\", \"phoneNumber\": \"+33123456789\"}"
                                    )
                            }
                    )
            )
            RegisterRequest request
    ) {
        return authenticationService.register(request);
    }

    @PostMapping("/auth/validate-email")
    @Operation(
            tags = {"Authentication"},
            summary = "Validate user email",
            description = "Validates a user's email address using the token sent to their email during registration. " +
                    "This endpoint confirms that the user has access to the email address they provided " +
                    "and completes the registration process, allowing the user to log in to the application."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Email successfully validated",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"Email successfully validated\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Bad request - Invalid token or already validated",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "invalidToken",
                                            summary = "Invalid or expired token",
                                            value = "{\"BAD_REQUEST\": \"Invalid or expired token\"}"
                                    ),
                                    @ExampleObject(
                                            name = "alreadyValidated",
                                            summary = "Email already validated",
                                            value = "{\"BAD_REQUEST\": \"Email already validated\"}"
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
    public ResponseEntity<Map<String, String>> validateEmail(
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Email validation token",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = ValidateEmailRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "tokenExample",
                                            summary = "Email validation token",
                                            value = "{\"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\"}"
                                    )
                            }
                    )
            )
            ValidateEmailRequest request
    ) {
        return authenticationService.validateEmail(request);
    }

    @PostMapping("/private/auth/validate-phone")
    @Operation(tags = {"Authentication"}, summary = "Valider le numéro de téléphone")
    public ResponseEntity<Map<String, String>> validatePhone(@RequestBody ValidatePhoneRequest request) {
        return authenticationService.validatePhone(request);
    }

    @PostMapping("/auth/resend-email-validation")
    @Operation(
            tags = {"Authentication"},
            summary = "Resend email validation link",
            description = "Resends the email validation link to a user who has not yet validated their email address. " +
                    "This is useful when the original validation email was not received or has expired. " +
                    "A new confirmation token will be generated and sent to the user's email address."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Confirmation email successfully sent",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"Confirmation email successfully sent\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Bad request - Email already validated",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "alreadyValidated",
                                            summary = "Email already validated",
                                            value = "{\"BAD_REQUEST\": \"Email already validated\"}"
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
                                            name = "emailSendError",
                                            summary = "Email sending failed",
                                            value = "{\"INTERNAL_SERVER_ERROR\": \"Failed to send the registration confirmation email. Please try again later.\"}"
                                    ),
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
    public ResponseEntity<Map<String, String>> resendEmailValidation(
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Email address for resending validation",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = ResendEmailValidationRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "emailExample",
                                            summary = "Email for validation resend",
                                            value = "{\"email\": \"user@example.com\"}"
                                    )
                            }
                    )
            )
            ResendEmailValidationRequest request
    ) {
        return authenticationService.resendEmailValidation(request);
    }

    @PostMapping("/private/auth/send-phone-code")
    @Operation(tags = {"Authentication"}, summary = "Envoyer un code pour valider le numéro de téléphone")
    public ResponseEntity<Map<String, String>> sendPhoneValidationCode() {
        return authenticationService.sendPhoneValidationCode();
    }

}
