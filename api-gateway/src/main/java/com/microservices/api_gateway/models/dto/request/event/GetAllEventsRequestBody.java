package com.microservices.api_gateway.models.dto.request.event;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetAllEventsRequestBody {
    private String filterSearch;
    private String filter;
}
