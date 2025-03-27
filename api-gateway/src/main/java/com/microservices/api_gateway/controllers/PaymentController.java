package com.microservices.api_gateway.controllers;

import com.microservices.api_gateway.models.User;
import com.microservices.api_gateway.models.dto.request.payment.PayWithCardRequest;
import com.microservices.api_gateway.models.dto.request.payment.PayWithPaypalRequest;
import com.microservices.api_gateway.services.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/private/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/card")
    @Operation(
            tags = {"Payment"},
            summary = "Process payment by credit card",
            description = "Processes a payment using credit card details. This endpoint validates user ID, event ID, " +
                    "and ticket IDs before processing the payment. The payment information is stored in the system " +
                    "for future reference and the tickets are associated with the user's account.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Payment processed successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"Payment processed successfully\"}"
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
                                            name = "invalidUser",
                                            summary = "Invalid user ID",
                                            value = "{\"BAD_REQUEST\": \"User with ID 12345 does not exist\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidEvent",
                                            summary = "Invalid event ID",
                                            value = "{\"BAD_REQUEST\": \"Event with ID 67890 does not exist\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidTicket",
                                            summary = "Invalid ticket ID",
                                            value = "{\"BAD_REQUEST\": \"Ticket with ID abc123 does not exist\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noTickets",
                                            summary = "No tickets provided",
                                            value = "{\"BAD_REQUEST\": \"No tickets provided for payment\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidAmount",
                                            summary = "Invalid amount",
                                            value = "{\"BAD_REQUEST\": \"Amount must be greater than 0\"}"
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
                                            name = "paymentProcessingFailed",
                                            summary = "Payment processing failed",
                                            value = "{\"INTERNAL_SERVER_ERROR\": \"Payment processing failed. Please try again later.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "serviceError",
                                            summary = "Payment service error",
                                            value = "{\"error\": \"Error communicating with the payment service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the payment service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, String>> payWithCard(
            @AuthenticationPrincipal User authenticatedUser,
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Payment details",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = PayWithCardRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "paymentExample",
                                            summary = "Credit card payment example",
                                            value = """
                                                    {
                                                      "userId": "12345",
                                                      "eventId": "67890",
                                                      "ticketsIds": ["ticket1", "ticket2"],
                                                      "amount": 150.00,
                                                      "cardNumber": "4111111111111111",
                                                      "cardholderName": "John Doe",
                                                      "expirationDate": "12/25",
                                                      "cvv": "123"
                                                    }"""
                                    )
                            }
                    )
            )
            PayWithCardRequest request
    ) {
        return paymentService.processCardPayment(request, authenticatedUser.getId());
    }

    @PostMapping("/paypal")
    @Operation(
            tags = {"Payment"},
            summary = "Process payment via PayPal",
            description = "Processes a payment using PayPal account. This endpoint validates user ID, event ID, " +
                    "and ticket IDs before processing the payment. Similar to card payments, " +
                    "the payment information is stored in the system and the tickets are associated with the user's account.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Payment processed successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"Payment processed successfully\"}"
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
                                            name = "invalidUser",
                                            summary = "Invalid user ID",
                                            value = "{\"BAD_REQUEST\": \"User with ID 12345 does not exist\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidEvent",
                                            summary = "Invalid event ID",
                                            value = "{\"BAD_REQUEST\": \"Event with ID 67890 does not exist\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidTicket",
                                            summary = "Invalid ticket ID",
                                            value = "{\"BAD_REQUEST\": \"Ticket with ID abc123 does not exist\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noTickets",
                                            summary = "No tickets provided",
                                            value = "{\"BAD_REQUEST\": \"No tickets provided for payment\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidAmount",
                                            summary = "Invalid amount",
                                            value = "{\"BAD_REQUEST\": \"Amount must be greater than 0\"}"
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
                                            name = "paymentProcessingFailed",
                                            summary = "Payment processing failed",
                                            value = "{\"INTERNAL_SERVER_ERROR\": \"Payment processing failed. Please try again later.\"}"
                                    ),
                                    @ExampleObject(
                                            name = "serviceError",
                                            summary = "Payment service error",
                                            value = "{\"error\": \"Error communicating with the payment service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the payment service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, String>> payWithPayPal(
            @AuthenticationPrincipal User authenticatedUser,
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "PayPal payment details",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = PayWithPaypalRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "paymentExample",
                                            summary = "PayPal payment example",
                                            value = """
                                                    {
                                                      "userId": "12345",
                                                      "eventId": "67890",
                                                      "ticketsIds": ["ticket1", "ticket2"],
                                                      "amount": 150.00,
                                                      "paypalEmail": "user@example.com",
                                                      "paypalTransactionId": "PP-12345678ABC"
                                                    }"""
                                    )
                            }
                    )
            )
            PayWithPaypalRequest request
    ) {
        return paymentService.processPayPalPayment(request, authenticatedUser.getId());
    }

}
