package com.microservices.api_gateway.models.dto.response.event;

import com.microservices.api_gateway.models.Event;
import com.microservices.api_gateway.models.enums.EventType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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
