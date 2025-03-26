package com.microservices.api_gateway.models;

import com.microservices.api_gateway.models.enums.TicketCategory;
import com.microservices.api_gateway.models.enums.TicketStatus;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
