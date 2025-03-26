package com.microservices.api_gateway.models.dto.request.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEventRequest {
    private String eventId;
    private String name;
    private String description;
    private String address;
    private String userId;
}
