package com.microservices.event_service.models.response;

import com.microservices.event_service.models.Event;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class GetEventByIdResponse {
    private Event event;
    private String error;
}
