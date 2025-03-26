package com.microservices.payment_service.models.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
