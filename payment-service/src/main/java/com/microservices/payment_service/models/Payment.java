package com.microservices.payment_service.models;

import com.microservices.payment_service.models.enums.PaymentMethod;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class Payment {

    @Id
    private String id;
    private String userId;
    private String eventId;
    private List<String> ticketsIds;
    private double amount;
    private PaymentMethod paymentMethod;

    @Builder.Default
    private LocalDateTime processedAt = LocalDateTime.now();

}