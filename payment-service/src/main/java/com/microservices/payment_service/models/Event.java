package com.microservices.payment_service.models;

import com.microservices.payment_service.models.enums.EventType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class Event {

    @Id
    private String id;
    private String name;
    private String description;
    private EventType eventType;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String address;
    private String organizerId;
    private int totalTickets;
    private int availableTickets;
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