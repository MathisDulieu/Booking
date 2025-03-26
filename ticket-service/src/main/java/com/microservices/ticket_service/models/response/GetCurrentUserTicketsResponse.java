package com.microservices.ticket_service.models.response;

import com.microservices.ticket_service.models.Ticket;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class GetCurrentUserTicketsResponse {
    private List<Ticket> tickets;
    private String error;
}