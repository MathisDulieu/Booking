package com.microservices.api_gateway.services;

import com.microservices.api_gateway.configurations.EnvConfiguration;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EnvConfiguration envConfiguration;

    public ResponseEntity<Map<String, String>> createEvent() {
        return null;
    }

    public ResponseEntity<Map<String, String>> getEventById() {
        return null;
    }

    public ResponseEntity<Map<String, String>> updateEvent() {
        return null;
    }

    public ResponseEntity<Map<String, String>> deleteEvent() {
        return null;
    }

    public ResponseEntity<Map<String, String>> getAllEvents() {
        return null;
    }
}
