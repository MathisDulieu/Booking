package com.microservices.api_gateway.services;

import com.microservices.api_gateway.Producer;
import com.microservices.api_gateway.models.dto.request.payment.PayWithCardRequest;
import com.microservices.api_gateway.models.dto.request.payment.PayWithPaypalRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final Producer producer;
    private final ErrorResponseService errorResponseService;

    @SuppressWarnings("unchecked")
    private <T> ResponseEntity<Map<String, String>> sendPaymentRequest(String routingKey, T request) {
        try {
            Map<String, String> response = producer.sendAndReceive(
                    "payment-exchange",
                    routingKey,
                    request,
                    Map.class
            );

            if (response == null) {
                return ResponseEntity.internalServerError()
                        .body(Map.of("error", "No response received from the payment service"));
            }

            return errorResponseService.mapToResponseEntity(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error communicating with the payment service: " + e.getMessage()));
        }
    }

    public ResponseEntity<Map<String, String>> processCardPayment(PayWithCardRequest request, String authenticatedUserId) {
        request.setUserId(authenticatedUserId);
        return sendPaymentRequest("payment.payWithCard", request);
    }

    public ResponseEntity<Map<String, String>> processPayPalPayment(PayWithPaypalRequest request, String authenticatedUserId) {
        request.setUserId(authenticatedUserId);
        return sendPaymentRequest("payment.payWithPaypal", request);
    }
}
