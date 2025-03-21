package com.microservices.api_gateway.controllers;

import com.microservices.api_gateway.services.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/private/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/card")
    @Operation(tags = {"Payment"}, summary = "Payer par carte bancaire")
    public ResponseEntity<Map<String, String>> payWithCard() {
        return paymentService.processCardPayment();
    }

    @PostMapping("/paypal")
    @Operation(tags = {"Payment"}, summary = "Payer par PayPal")
    public ResponseEntity<Map<String, String>> payWithPayPal() {
        return paymentService.processPayPalPayment();
    }
}
