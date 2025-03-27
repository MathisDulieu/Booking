package com.microservices.api_gateway.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.microservices.api_gateway.models.User;
import com.microservices.api_gateway.models.dto.request.event.CreateEventRequest;
import com.microservices.api_gateway.models.dto.request.event.GetAllEventsRequestBody;
import com.microservices.api_gateway.models.dto.request.event.UpdateEventRequest;
import com.microservices.api_gateway.models.dto.response.event.GetAllEventsResponse;
import com.microservices.api_gateway.models.dto.response.event.GetEventByIdResponse;
import com.microservices.api_gateway.services.EventService;
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
public class EventController {

    private final EventService eventService;

    @PostMapping("/events")
    @Operation(
            tags = {"Event"},
            summary = "Get all events",
            description = "Retrieves a paginated list of events with optional filtering capabilities. " +
                    "The results can be filtered by various criteria and search terms. " +
                    "This endpoint supports pagination to efficiently handle large result sets."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successful retrieval of events",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "eventsResponse",
                                            summary = "Events response",
                                            value = "{\"events\": {\"events\": [{\"id\":\"1\",\"title\":\"Concert\",\"description\":\"Music concert\"},{\"id\":\"2\",\"title\":\"Conference\",\"description\":\"Tech conference\"}],\"eventsFound\":45,\"totalPages\":5}}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "200",
                    description = "Warning - No events found or page exceeds limit",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GetAllEventsResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "noEventsFound",
                                            summary = "No events found",
                                            value = "{\"warning\": {\"error\":\"No event found\",\"eventsFound\":0,\"totalPages\":0}}"
                                    ),
                                    @ExampleObject(
                                            name = "pageExceedsLimit",
                                            summary = "Page exceeds available pages",
                                            value = "{\"warning\": {\"error\":\"Requested page exceeds the total number of available pages\",\"eventsFound\":45,\"totalPages\":5}}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Bad request - Invalid parameters",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GetAllEventsResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "invalidPage",
                                            summary = "Invalid page number",
                                            value = "{\"BAD_REQUEST\": {\"error\":\"Page number must be greater than or equal to zero\"}}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidFilter",
                                            summary = "Invalid filter",
                                            value = "{\"BAD_REQUEST\": {\"error\":\"Invalid filter provided\"}}"
                                    ),
                                    @ExampleObject(
                                            name = "invalidPageSize",
                                            summary = "Invalid page size",
                                            value = "{\"BAD_REQUEST\": {\"error\":\"Page size must be greater than or equal to zero\"}}"
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
                                            summary = "Event service error",
                                            value = "{\"error\": {\"error\":\"Error communicating with event service: Connection timeout\"}}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": {\"error\":\"No response received from event service\"}}"
                                    ),
                                    @ExampleObject(
                                            name = "processingError",
                                            summary = "Processing error",
                                            value = "{\"error\": {\"error\":\"Processing error: Failed to parse JSON response\"}}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, GetAllEventsResponse>> getAllEvents(
            @Parameter(
                    description = "Page number (zero-based index)",
                    example = "0"
            )
            @RequestParam(defaultValue = "0") int page,

            @Parameter(
                    description = "Number of items per page",
                    example = "10"
            )
            @RequestParam(defaultValue = "10") int pageSize,

            @RequestBody(required = false)
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Filter criteria for events",
                    required = false,
                    content = @Content(
                            schema = @Schema(implementation = GetAllEventsRequestBody.class),
                            examples = {
                                    @ExampleObject(
                                            name = "filterExample",
                                            summary = "Filter by category",
                                            value = "{\"filter\": \"category\", \"filterSearch\": \"concert\"}"
                                    ),
                                    @ExampleObject(
                                            name = "emptyFilter",
                                            summary = "No filter (get all events)",
                                            value = "{}"
                                    )
                            }
                    )
            )
            GetAllEventsRequestBody requestBody
    ) throws JsonProcessingException {
        String filter = requestBody != null ? requestBody.getFilter() : null;
        String filterSearch = requestBody != null ? requestBody.getFilterSearch() : null;
        return eventService.getAllEvents(page, pageSize, filter, filterSearch);
    }

    @GetMapping("/events/{id}")
    @Operation(
            tags = {"Event"},
            summary = "Get event by ID",
            description = "Retrieves a specific event by its unique identifier. " +
                    "This endpoint provides detailed information about a single event, " +
                    "including its title, description, date, location, and other related data."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Event found successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "eventResponse",
                                            summary = "Event details",
                                            value = "{\"informations\": {\"event\":{\"id\":\"12345\",\"title\":\"Summer Concert\",\"description\":\"Annual summer music festival\",\"date\":\"2025-07-15T18:00:00\",\"location\":\"Central Park\",\"category\":\"Music\"}}}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Event not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GetEventByIdResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "eventNotFound",
                                            summary = "Event not found",
                                            value = "{\"NOT_FOUND\": {\"error\":\"Event not found\"}}"
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
                                            summary = "Event service error",
                                            value = "{\"error\": {\"error\":\"Error communicating with event service: Connection timeout\"}}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": {\"error\":\"No response received from event service\"}}"
                                    ),
                                    @ExampleObject(
                                            name = "emptyResponse",
                                            summary = "Empty response",
                                            value = "{\"error\": {\"error\":\"Empty response received from service\"}}"
                                    ),
                                    @ExampleObject(
                                            name = "processingError",
                                            summary = "Processing error",
                                            value = "{\"error\": {\"error\":\"Processing error: Failed to parse JSON response\"}}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, GetEventByIdResponse>> getEventById(
            @Parameter(
                    description = "ID of the event to retrieve",
                    required = true,
                    example = "12345",
                    schema = @Schema(type = "string")
            )
            @PathVariable("id") String eventId
    ) throws JsonProcessingException {
        return eventService.getEventById(eventId);
    }

    @PostMapping("/private/artist/event")
    @Operation(
            tags = {"Event"},
            summary = "Create a new event",
            description = "Creates a new event in the system with the authenticated user as the organizer. " +
                    "This endpoint requires authentication and validates various event properties " +
                    "such as name, address, ticket counts, description, prices, and timing. " +
                    "The authenticated user must have appropriate permissions to create events.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Event created successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"Event created successfully\"}"
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
                                            name = "eventNameError",
                                            summary = "Invalid event name",
                                            value = "{\"BAD_REQUEST\": \"Event name must be between 3 and 15 characters\"}"
                                    ),
                                    @ExampleObject(
                                            name = "addressError",
                                            summary = "Invalid address",
                                            value = "{\"BAD_REQUEST\": \"Event address must be between 3 and 30 characters\"}"
                                    ),
                                    @ExampleObject(
                                            name = "ticketCountError",
                                            summary = "Invalid ticket count",
                                            value = "{\"BAD_REQUEST\": \"Premium tickets count cannot be negative\"}"
                                    ),
                                    @ExampleObject(
                                            name = "descriptionError",
                                            summary = "Description too long",
                                            value = "{\"BAD_REQUEST\": \"Event description cannot exceed 150 characters\"}"
                                    ),
                                    @ExampleObject(
                                            name = "ticketPriceError",
                                            summary = "Invalid ticket price",
                                            value = "{\"BAD_REQUEST\": \"Standard ticket price must be greater than zero\"}"
                                    ),
                                    @ExampleObject(
                                            name = "eventTimeError",
                                            summary = "Invalid event time",
                                            value = "{\"BAD_REQUEST\": \"Event start time cannot be in the past\"}"
                                    ),
                                    @ExampleObject(
                                            name = "imageUrlError",
                                            summary = "Invalid image URL",
                                            value = "{\"BAD_REQUEST\": \"Image URL must start with 'https://'\"}"
                                    ),
                                    @ExampleObject(
                                            name = "eventTypeError",
                                            summary = "Invalid event type",
                                            value = "{\"BAD_REQUEST\": \"Invalid event type. Must be either 'FESTIVAL' or 'CONCERT'\"}"
                                    ),
                                    @ExampleObject(
                                            name = "multipleErrors",
                                            summary = "Multiple validation errors",
                                            value = "{\"BAD_REQUEST\": \"Event name must be between 3 and 15 characters, Standard ticket price must be greater than zero\"}"
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
                                            summary = "Insufficient permissions",
                                            value = "{\"FORBIDDEN\": \"You do not have permission to create events\"}"
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
                                            summary = "Event service error",
                                            value = "{\"error\": \"Error communicating with event service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from event service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, String>> createEvent(
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Event creation details",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = CreateEventRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "validEvent",
                                            summary = "Valid event creation",
                                            value = """
                                                    {
                                                      "name": "Summer Festival",
                                                      "address": "123 Main Street, City",
                                                      "description": "Annual summer music festival",
                                                      "imageUrl": "https://example.com/images/summer-fest.jpg",
                                                      "startTime": "2025-07-15T18:00:00",
                                                      "endTime": "2025-07-15T23:00:00",
                                                      "eventType": "FESTIVAL",
                                                      "availableStandardTickets": 1000,
                                                      "availablePremiumTickets": 500,
                                                      "availableVIPTickets": 100,
                                                      "standardTicketsPrice": 50,
                                                      "premiumTicketsPrice": 100,
                                                      "VIPTicketsPrice": 200
                                                    }"""
                                    )
                            }
                    )
            )
            CreateEventRequest request,

            @Parameter(hidden = true)
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return eventService.createEvent(request, authenticatedUser.getId());
    }

    @PutMapping("/private/artist/event")
    @Operation(
            tags = {"Event"},
            summary = "Update an existing event",
            description = "Updates an existing event with new information. Only the event organizer can modify their own events. " +
                    "At least one field (name, address, or description) must be provided for the update. " +
                    "Each field that is provided is validated according to the same rules used during event creation.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Event updated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"Event with id: 12345 updated successfully\"}"
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
                                            value = "{\"BAD_REQUEST\": \"At least one field (name, address, or description) must be provided for update\"}"
                                    ),
                                    @ExampleObject(
                                            name = "eventNameError",
                                            summary = "Invalid event name",
                                            value = "{\"BAD_REQUEST\": \"Event name must be between 3 and 15 characters\"}"
                                    ),
                                    @ExampleObject(
                                            name = "addressError",
                                            summary = "Invalid address",
                                            value = "{\"BAD_REQUEST\": \"Event address must be between 3 and 30 characters\"}"
                                    ),
                                    @ExampleObject(
                                            name = "descriptionError",
                                            summary = "Description too long",
                                            value = "{\"BAD_REQUEST\": \"Event description cannot exceed 150 characters\"}"
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
                    description = "Forbidden - Not the event organizer",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "notOrganizer",
                                            summary = "Not the event organizer",
                                            value = "{\"FORBIDDEN\": \"You are not authorized to update this event\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Not found - Event not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "eventNotFound",
                                            summary = "Event not found",
                                            value = "{\"NOT_FOUND\": \"Event not found\"}"
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
                                            summary = "Event service error",
                                            value = "{\"error\": \"Error communicating with event service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from event service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, String>> updateEvent(
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Event update details",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = UpdateEventRequest.class),
                            examples = {
                                    @ExampleObject(
                                            name = "updateExample",
                                            summary = "Event update example",
                                            value = """
                                                    {
                                                      "eventId": "12345",
                                                      "name": "Updated Festival Name",
                                                      "address": "456 New Location, City",
                                                      "description": "Updated description for the annual festival"
                                                    }"""
                                    )
                            }
                    )
            )
            UpdateEventRequest request,

            @Parameter(hidden = true)
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return eventService.updateEvent(request, authenticatedUser.getId());
    }

    @DeleteMapping("/private/artist/event/{id}")
    @Operation(
            tags = {"Event"},
            summary = "Delete an event",
            description = "Deletes an existing event from the system. This operation can only be performed by the " +
                    "original organizer of the event. Once deleted, the event cannot be recovered and all associated " +
                    "data will be permanently removed.",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Event deleted successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "object"),
                            examples = {
                                    @ExampleObject(
                                            name = "successResponse",
                                            summary = "Success response",
                                            value = "{\"message\": \"Event deleted successfully\"}"
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
                    description = "Forbidden - Not the event organizer",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "notOrganizer",
                                            summary = "Not the event organizer",
                                            value = "{\"FORBIDDEN\": \"You are not authorized to delete this event\"}"
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Not found - Event not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "eventNotFound",
                                            summary = "Event not found",
                                            value = "{\"NOT_FOUND\": \"Event not found\"}"
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
                                            summary = "Event service error",
                                            value = "{\"error\": \"Error communicating with event service: Connection timeout\"}"
                                    ),
                                    @ExampleObject(
                                            name = "noResponse",
                                            summary = "No response received",
                                            value = "{\"error\": \"No response received from event service\"}"
                                    )
                            }
                    )
            )
    })
    public ResponseEntity<Map<String, String>> deleteEvent(
            @Parameter(
                    description = "ID of the event to delete",
                    required = true,
                    example = "12345",
                    schema = @Schema(type = "string")
            )
            @PathVariable("id") String eventId,

            @Parameter(hidden = true)
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return eventService.deleteEvent(eventId, authenticatedUser.getId());
    }
}
