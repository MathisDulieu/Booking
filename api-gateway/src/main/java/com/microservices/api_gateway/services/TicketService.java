package com.microservices.api_gateway.services;

import com.microservices.api_gateway.configurations.EnvConfiguration;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final EnvConfiguration envConfiguration;

    public ResponseEntity<Map<String, String>> cancelTicket() {
        return null;
    }

    public ResponseEntity<Map<String, String>> getCurrentUserTickets() {
        return null;
    }

    public ResponseEntity<Map<String, String>> validateTicket() {
        return null;
    }
}
