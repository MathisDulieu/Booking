package com.microservices.ticket_service.services;

import com.microservices.ticket_service.dao.TicketDao;
import com.microservices.ticket_service.models.Ticket;
import com.microservices.ticket_service.models.TicketStatus;
import com.microservices.ticket_service.models.request.CancelTicketRequest;
import com.microservices.ticket_service.models.request.ValidateTicketRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import static java.util.Collections.singletonMap;

@Service
@RequiredArgsConstructor
public class TicketManagementService {

    private final TicketDao ticketDao;

    public Map<String, String> cancelTicket(CancelTicketRequest request) {
        Optional<Ticket> optionalTicket = ticketDao.findById(request.getTicketId());
        if (optionalTicket.isEmpty()) {
            return singletonMap("NOT_FOUND", "Ticket not found with the specified ID");
        }

        if (!Objects.equals(optionalTicket.get().getUserId(), request.getUserId())) {
            return singletonMap("FORBIDDEN", "You are not authorized to cancel this ticket");
        }

        if (optionalTicket.get().getStatus() == TicketStatus.USED) {
            return singletonMap("BAD_REQUEST", "Cannot cancel a ticket that has already been used");
        }

        ticketDao.delete(optionalTicket.get().getId());

        return singletonMap("message", "Ticket canceled successfully");
    }

    public Map<String, String> validateTicket(ValidateTicketRequest request) {
        Optional<Ticket> optionalTicket = ticketDao.findById(request.getTicketId());
        if (optionalTicket.isEmpty()) {
            return singletonMap("NOT_FOUND", "Ticket not found with the specified ID");
        }

        optionalTicket.get().setStatus(TicketStatus.USED);
        optionalTicket.get().setScanTime(LocalDateTime.now());

        ticketDao.save(optionalTicket.get());

        return singletonMap("message", "Ticket validated successfully");
    }

}
