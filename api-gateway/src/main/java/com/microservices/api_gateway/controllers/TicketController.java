package com.microservices.api_gateway.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.microservices.api_gateway.models.User;
import com.microservices.api_gateway.models.dto.request.ticket.CreateTicketsRequest;
import com.microservices.api_gateway.models.dto.response.ticket.GetCurrentUserTicketsResponse;
import com.microservices.api_gateway.services.TicketService;
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
public class TicketController {

    private final TicketService ticketService;

    @GetMapping("/private/tickets")
    @Operation(
            tags = {"Ticket"},
            summary = "Get tickets for the authenticated user",
            description = "Retrieves all tickets purchased by the currently authenticated user. " +
                    "This endpoint returns ticket details including event information, ticket type, " +
                    "purchase date, and ticket status.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved tickets",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "ticketsResponse",
                                            summary = "User tickets list",
                                            value = "{\"message\": {\"tickets\":[{\"id\":\"ticket1\",\"eventId\":\"event123\",\"userId\":\"12345\",\"ticketType\":\"VIP\",\"price\":150.00,\"purchaseDate\":\"2025-03-20T15:30:00\",\"status\":\"ACTIVE\"},{\"id\":\"ticket2\",\"eventId\":\"event456\",\"userId\":\"12345\",\"ticketType\":\"STANDARD\",\"price\":50.00,\"purchaseDate\":\"2025-03-15T10:45:00\",\"status\":\"ACTIVE\"}]}}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "200",
                    description = "Warning - No tickets found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GetCurrentUserTicketsResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "noTicketsFound",
                                            summary = "No tickets for user",
                                            value = "{\"warning\": {\"error\":\"No tickets found for this user\"}}"
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
                                            summary = "Ticket service error",
                                            value = "{\"error\": \"Error communicating with the ticket service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the ticket service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, GetCurrentUserTicketsResponse>> getUserTickets(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return ticketService.getCurrentUserTickets(authenticatedUser.getId());
    }

    @PutMapping("/private/ticket/{ticketId}/cancel")
    @Operation(
            tags = {"Ticket"},
            summary = "Cancel a ticket",
            description = "Cancels a ticket owned by the authenticated user. Only the owner of the ticket can " +
                    "cancel it, and tickets that have already been used cannot be canceled. " +
                    "When a ticket is canceled, it is permanently removed from the system.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Ticket successfully canceled",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"Ticket canceled successfully\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Bad request - Cannot cancel the ticket",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "ticketUsed",
                                            summary = "Ticket already used",
                                            value = "{\"BAD_REQUEST\": \"Cannot cancel a ticket that has already been used\"}"
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
                    description = "Forbidden - Not the ticket owner",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "notOwner",
                                            summary = "Not the ticket owner",
                                            value = "{\"FORBIDDEN\": \"You are not authorized to cancel this ticket\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Not found - Ticket not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "ticketNotFound",
                                            summary = "Ticket not found",
                                            value = "{\"NOT_FOUND\": \"Ticket not found with the specified ID\"}"
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
                                            summary = "Ticket service error",
                                            value = "{\"error\": \"Error communicating with the ticket service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the ticket service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, String>> cancelTicket(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User authenticatedUser,

            @Parameter(
                    description = "ID of the ticket to cancel",
                    required = true,
                    example = "ticket123",
                    schema = @Schema(type = "string")
            )
            @PathVariable("ticketId") String ticketId
    ) {
        return ticketService.cancelTicket(ticketId, authenticatedUser.getId());
    }

    @PutMapping("/private/admin/ticket/{ticketId}/validate")
    @Operation(
            tags = {"Ticket"},
            summary = "Validate a ticket",
            description = "Marks a ticket as used/validated by an administrator or event staff. " +
                    "This endpoint changes the ticket status to 'USED' and records the validation timestamp. " +
                    "This operation is typically performed at event entry points to prevent ticket reuse.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Ticket successfully validated",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"Ticket validated successfully\"}"
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
                                            value = "{\"FORBIDDEN\": \"This endpoint is restricted to administrators or event staff\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Not found - Ticket not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "ticketNotFound",
                                            summary = "Ticket not found",
                                            value = "{\"NOT_FOUND\": \"Ticket not found with the specified ID\"}"
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
                                            summary = "Ticket service error",
                                            value = "{\"error\": \"Error communicating with the ticket service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the ticket service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, String>> validateTicket(
            @Parameter(
                    description = "ID of the ticket to validate",
                    required = true,
                    example = "ticket123",
                    schema = @Schema(type = "string")
            )
            @PathVariable("ticketId") String ticketId
    ) {
        return ticketService.validateTicket(ticketId);
    }

    @PostMapping("/private/tickets")
    @Operation(
            tags = {"Ticket"},
            summary = "Create tickets",
            description = "Creates one or more tickets for a user. This endpoint allows users to purchase " +
                    "tickets for events, specifying ticket category and quantity. " +
                    "The tickets are associated with the authenticated user's account and the specified event.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Tickets created successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"Tickets created successfully\"}"
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
                                            name = "invalidTicketData",
                                            summary = "Invalid ticket data",
                                            value = "{\"BAD_REQUEST\": \"Event not found for the specified ID\"}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidCategory",
                                            summary = "Invalid ticket category",
                                            value = "{\"BAD_REQUEST\": \"Invalid ticket category\"}"
                                    ),
                                    @ExampleObject(
                                            name = "multipleErrors",
                                            summary = "Multiple validation errors",
                                            value = "{\"BAD_REQUEST\": \"Event not found for the specified ID, Invalid ticket category\"}"
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
                                            summary = "Ticket service error",
                                            value = "{\"error\": \"Error communicating with the ticket service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from the ticket service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, String>> createTickets(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User authenticatedUser,

            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Ticket creation details",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = CreateTicketsRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "ticketsExample",
                                            summary = "Create multiple tickets",
                                            value = """
                                                    {
                                                      "tickets": [
                                                        {
                                                          "eventId": "event123",
                                                          "ticketCategory": "VIP",
                                                          "price": 150.00
                                                        },
                                                        {
                                                          "eventId": "event123",
                                                          "ticketCategory": "STANDARD",
                                                          "price": 50.00
                                                        }
                                                      ]
                                                    }"""
                                    )
                            }
                    )
            )
            CreateTicketsRequest request
    ) {
        return ticketService.createTickets(request, authenticatedUser.getId());
    }

}
