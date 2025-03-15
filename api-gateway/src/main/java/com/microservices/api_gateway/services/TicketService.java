package com.microservices.api_gateway.services;

import com.microservices.api_gateway.configuration.EnvConfiguration;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class TicketService {

    private EnvConfiguration envConfiguration;

    public ResponseEntity<Map<String, String>> buyTicket() {
        return null;
    }

    public ResponseEntity<Map<String, String>> getTicketById() {
        return null;
    }

    public ResponseEntity<Map<String, String>> getUserTickets() {
        return null;
    }

    public ResponseEntity<Map<String, String>> cancelTicket() {
        return null;
    }
}
