package com.microservices.api_gateway.models.dto.request.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetAllEventsRequest {
    private int page;
    private int pageSize;
    private String filter;
    private String filterSearch;
}
