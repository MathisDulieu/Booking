package com.microservices.api_gateway.models.dto.response.event;

import com.microservices.api_gateway.models.Event;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class GetAllEventsResponse {
    private List<Event> events;
    private String error;
    private long eventsFound;
    private int totalPages;
}
