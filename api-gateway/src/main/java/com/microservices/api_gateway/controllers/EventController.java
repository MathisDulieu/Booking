package com.microservices.api_gateway.controllers;

import com.microservices.api_gateway.services.EventService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping("/events")
    @Operation(tags = {"Event"}, summary = "Récupérer tous les événements")
    public ResponseEntity<Map<String, String>> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/events/{id}")
    @Operation(tags = {"Event"}, summary = "Récupérer un événement par son id")
    public ResponseEntity<Map<String, String>> getEventById() {
        return eventService.getEventById();
    }

    @PostMapping("/private/artist/event")
    @Operation(tags = {"Event"}, summary = "Créer un événement")
    public ResponseEntity<Map<String, String>> createEvent() {
        return eventService.createEvent();
    }

    @PutMapping("/private/artist/event/{id}")
    @Operation(tags = {"Event"}, summary = "Modifier un événement")
    public ResponseEntity<Map<String, String>> updateEvent() {
        return eventService.updateEvent();
    }

    @DeleteMapping("/private/artist/event/{id}")
    @Operation(tags = {"Event"}, summary = "Supprimer un événement")
    public ResponseEntity<Map<String, String>> deleteEvent() {
        return eventService.deleteEvent();
    }
}
