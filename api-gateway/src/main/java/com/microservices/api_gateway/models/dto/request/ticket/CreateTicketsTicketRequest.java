package com.microservices.api_gateway.models.dto.request.ticket;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateTicketsTicketRequest {
    private String eventId;
    private String ticketCategory;
    private int price;
}
