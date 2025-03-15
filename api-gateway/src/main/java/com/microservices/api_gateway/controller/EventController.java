package com.microservices.api_gateway.controller;

import com.microservices.api_gateway.services.EventService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    @Operation(tags = {"Event"})
    public ResponseEntity<Map<String, String>> createEvent() {
        return eventService.createEvent();
    }

    @GetMapping("/{id}")
    @Operation(tags = {"Event"})
    public ResponseEntity<Map<String, String>> getEventById() {
        return eventService.getEventById();
    }

    @GetMapping
    @Operation(tags = {"Event"})
    public ResponseEntity<Map<String, String>> getEvents() {
        return eventService.getEvents();
    }

    @PutMapping("/{id}")
    @Operation(tags = {"Event"})
    public ResponseEntity<Map<String, String>> updateEvent() {
        return eventService.updateEvent();
    }

    @DeleteMapping("/{id}")
    @Operation(tags = {"Event"})
    public ResponseEntity<Map<String, String>> deleteEvent() {
        return eventService.deleteEvent();
    }

}
