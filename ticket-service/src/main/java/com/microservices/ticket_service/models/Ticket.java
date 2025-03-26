package com.microservices.ticket_service.models;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class Ticket {

    @Id
    private String id;
    private String eventId;
    private String userId;
    private TicketCategory ticketCategory;
    private double price;

    @Builder.Default
    private TicketStatus status = TicketStatus.VALID;

    private LocalDateTime scanTime;
    private String qrCodeData;
}
