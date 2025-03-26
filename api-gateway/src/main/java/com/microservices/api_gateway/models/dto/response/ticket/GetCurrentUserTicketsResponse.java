package com.microservices.api_gateway.models.dto.response.ticket;


import com.microservices.api_gateway.models.Ticket;
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
