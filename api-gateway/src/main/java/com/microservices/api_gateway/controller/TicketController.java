package com.microservices.api_gateway.controller;

import com.microservices.api_gateway.services.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping("/buy")
    @Operation(tags = {"Ticket"})
    public ResponseEntity<Map<String, String>> buyTicket() {
        return ticketService.buyTicket();
    }

    @GetMapping("/{id}")
    @Operation(tags = {"Ticket"})
    public ResponseEntity<Map<String, String>> getTicketById() {
        return ticketService.getTicketById();
    }

    @GetMapping("/user/{id}")
    @Operation(tags = {"Ticket"})
    public ResponseEntity<Map<String, String>> getUserTickets() {
        return ticketService.getUserTickets();
    }

    @DeleteMapping("/{id}")
    @Operation(tags = {"Ticket"})
    public ResponseEntity<Map<String, String>> cancelTicket() {
        return ticketService.cancelTicket();
    }

}
