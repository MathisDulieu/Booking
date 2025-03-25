package com.microservices.payment_service.dao;

import com.microservices.payment_service.models.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaymentDao {

    private final MongoTemplate mongoTemplate;

    private static final String PAYMENT_COLLECTION = "PAYMENTS";

    public void save(Payment payment) {
        mongoTemplate.save(payment, PAYMENT_COLLECTION);
    }

}
