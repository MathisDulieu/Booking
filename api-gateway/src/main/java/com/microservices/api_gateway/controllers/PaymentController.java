package com.microservices.api_gateway.controllers;

import com.microservices.api_gateway.models.dto.request.payment.PayWithCardRequest;
import com.microservices.api_gateway.models.dto.request.payment.PayWithPaypalRequest;
import com.microservices.api_gateway.services.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/private/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/card")
    @Operation(
            tags = {"Payment"},
            summary = "Payer par carte bancaire",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, String>> payWithCard(
            @RequestBody PayWithCardRequest request
    ) {
        return paymentService.processCardPayment(request);
    }

    @PostMapping("/paypal")
    @Operation(
            tags = {"Payment"},
            summary = "Payer par PayPal",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, String>> payWithPayPal(
            @RequestBody PayWithPaypalRequest request
    ) {
        return paymentService.processPayPalPayment(request);
    }

}
