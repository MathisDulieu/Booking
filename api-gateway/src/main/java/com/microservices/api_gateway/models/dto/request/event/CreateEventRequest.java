package com.microservices.api_gateway.models.dto.request.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateEventRequest {
    private String name;
    private String description;
    private String eventType;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String address;
    private String organizerId;
    private int availableStandardTickets;
    private int standardTicketsPrice;
    private int availablePremiumTickets;
    private int premiumTicketsPrice;
    private int availableVIPTickets;
    private int VIPTicketsPrice;
    private int minimumPrice;
    private String imageUrl;
    private List<String> artists;
}
