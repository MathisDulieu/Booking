package com.microservices.ticket_service.models.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateTicketsRequest {
    private String userId;
    private List<CreateTicketsTicketRequest> tickets;
}

