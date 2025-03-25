package com.microservices.payment_service.models.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PayWithCardRequest {

    private String userId;
    private String eventId;
    private List<String> ticketsIds;
    private double amount;

}
