package com.microservices.api_gateway.controller;

import com.microservices.api_gateway.services.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @Operation(tags = {"Payment"})
    public ResponseEntity<Map<String, String>> processPayment() {
        return paymentService.processPayment();
    }

    @GetMapping("/{id}")
    @Operation(tags = {"Payment"})
    public ResponseEntity<Map<String, String>> getPaymentStatus() {
        return paymentService.getPaymentStatus();
    }

}
