package com.microservices.api_gateway.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.microservices.api_gateway.models.User;
import com.microservices.api_gateway.models.dto.request.ticket.CreateTicketsRequest;
import com.microservices.api_gateway.models.dto.response.ticket.GetCurrentUserTicketsResponse;
import com.microservices.api_gateway.services.TicketService;
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
public class TicketController {

    private final TicketService ticketService;

    @GetMapping("/private/tickets")
    @Operation(
            tags = {"Ticket"},
            summary = "Récupérer les billets de l'utilisateur connecté",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, GetCurrentUserTicketsResponse>> getUserTickets(
            @AuthenticationPrincipal User authenticatedUser
    ) throws JsonProcessingException {
        return ticketService.getCurrentUserTickets(authenticatedUser.getId());
    }

    @PutMapping("/private/ticket/{ticketId}/cancel")
    @Operation(
            tags = {"Ticket"},
            summary = "Annuler un billet",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, String>> cancelTicket(
            @AuthenticationPrincipal User authenticatedUser,
            @PathVariable("ticketId") String ticketId
    ) {
        return ticketService.cancelTicket(ticketId, authenticatedUser.getId());
    }

    @PutMapping("/private/admin/ticket/{ticketId}/validate")
    @Operation(
            tags = {"Ticket"},
            summary = "Valider un billet",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, String>> validateTicket(
            @PathVariable("ticketId") String ticketId
    ) {
        return ticketService.validateTicket(ticketId);
    }

    @PostMapping("/private/tickets")
    @Operation(
            tags = {"Ticket"},
            summary = "Créer des billets",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, String>> createTickets(
            @AuthenticationPrincipal User authenticatedUser,
            @RequestBody CreateTicketsRequest request
    ) {
        return ticketService.createTickets(request, authenticatedUser.getId());
    }

}
