package com.microservices.event_service.models.response;

import com.microservices.event_service.models.Event;
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