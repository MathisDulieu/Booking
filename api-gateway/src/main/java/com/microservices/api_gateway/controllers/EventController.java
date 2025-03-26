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
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
            summary = "Récupérer tous les événements"
    )
    public ResponseEntity<Map<String, GetAllEventsResponse>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestBody(required = false) GetAllEventsRequestBody requestBody
    ) throws JsonProcessingException {
        return eventService.getAllEvents(page, pageSize, requestBody.getFilter(), requestBody.getFilterSearch());
    }

    @GetMapping("/events/{id}")
    @Operation(
            tags = {"Event"},
            summary = "Récupérer un événement par son id"
    )
    public ResponseEntity<Map<String, GetEventByIdResponse>> getEventById(
            @PathVariable("id") String eventId
    ) throws JsonProcessingException {
        return eventService.getEventById(eventId);
    }

    @PostMapping("/private/artist/event")
    @Operation(
            tags = {"Event"},
            summary = "Créer un événement",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, String>> createEvent(
            @RequestBody CreateEventRequest request,
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return eventService.createEvent(request, authenticatedUser.getId());
    }

    @PutMapping("/private/artist/event")
    @Operation(
            tags = {"Event"},
            summary = "Modifier un événement",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, String>> updateEvent(
            @RequestBody UpdateEventRequest request,
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return eventService.updateEvent(request, authenticatedUser.getId());
    }

    @DeleteMapping("/private/artist/event/{id}")
    @Operation(
            tags = {"Event"},
            summary = "Supprimer un événement",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, String>> deleteEvent(
            @PathVariable("id") String eventId,
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return eventService.deleteEvent(eventId, authenticatedUser.getId());
    }
}
