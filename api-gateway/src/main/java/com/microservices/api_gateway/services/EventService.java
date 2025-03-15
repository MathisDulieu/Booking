package com.microservices.api_gateway.services;

import com.microservices.api_gateway.configuration.EnvConfiguration;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EventService {

    private EnvConfiguration envConfiguration;

    public ResponseEntity<Map<String, String>> createEvent() {
        return null;
    }

    public ResponseEntity<Map<String, String>> getEventById() {
        return null;
    }

    public ResponseEntity<Map<String, String>> getEvents() {
        return null;
    }

    public ResponseEntity<Map<String, String>> updateEvent() {
        return null;
    }

    public ResponseEntity<Map<String, String>> deleteEvent() {
        return null;
    }
}
