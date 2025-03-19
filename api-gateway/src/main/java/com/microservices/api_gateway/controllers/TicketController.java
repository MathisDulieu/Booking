package com.microservices.api_gateway.controllers;

import com.microservices.api_gateway.services.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping("/private/tickets")
    @Operation(tags = {"Ticket"}, summary = "Récupérer les billets de l'utilisateur connecté")
    public ResponseEntity<Map<String, String>> getUserTickets() {
        return ticketService.getCurrentUserTickets();
    }

    @PutMapping("/private/ticket/{ticketId}/cancel")
    @Operation(tags = {"Ticket"}, summary = "Annuler un billet")
    public ResponseEntity<Map<String, String>> cancelTicket() {
        return ticketService.cancelTicket();
    }

    @PutMapping("/private/admin/ticket/{ticketId}/validate")
    @Operation(tags = {"Ticket"}, summary = "Valider un billet")
    public ResponseEntity<Map<String, String>> validateTicket() {
        return ticketService.validateTicket();
    }
}
