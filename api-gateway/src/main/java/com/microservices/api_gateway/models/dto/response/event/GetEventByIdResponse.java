package com.microservices.api_gateway.models.dto.response.event;

import com.microservices.api_gateway.models.Event;
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
