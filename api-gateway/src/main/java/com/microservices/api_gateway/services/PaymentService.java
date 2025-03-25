package com.microservices.api_gateway.services;

import com.microservices.api_gateway.Producer;
import com.microservices.api_gateway.configurations.EnvConfiguration;
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
                        .body(Map.of("error", "Aucune réponse reçue du service de paiement"));
            }

            return errorResponseService.mapToResponseEntity(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Erreur lors de la communication avec le service de paiement : " + e.getMessage()));
        }
    }

    public ResponseEntity<Map<String, String>> processCardPayment(PayWithCardRequest request) {
        return sendPaymentRequest("payment.payWithCard", request);
    }

    public ResponseEntity<Map<String, String>> processPayPalPayment(PayWithPaypalRequest request) {
        return sendPaymentRequest("payment.payWithPaypal", request);
    }
}
