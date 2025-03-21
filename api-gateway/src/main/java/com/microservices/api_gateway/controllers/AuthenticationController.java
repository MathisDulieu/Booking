package com.microservices.api_gateway.controllers;

import com.microservices.api_gateway.models.dto.request.authentication.*;
import com.microservices.api_gateway.services.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/auth/login")
    @Operation(tags = {"Authentication"}, summary = "Login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        return authenticationService.login(request);
    }

    @PostMapping("/auth/register")
    @Operation(tags = {"Authentication"}, summary = "Register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        return authenticationService.register(request);
    }

    @PostMapping("/auth/validate-email")
    @Operation(tags = {"Authentication"}, summary = "Valider l'email")
    public ResponseEntity<Map<String, String>> validateEmail(@RequestBody ValidateEmailRequest request) {
        return authenticationService.validateEmail(request);
    }

    @PostMapping("/private/auth/validate-phone")
    @Operation(tags = {"Authentication"}, summary = "Valider le numéro de téléphone")
    public ResponseEntity<Map<String, String>> validatePhone(@RequestBody ValidatePhoneRequest request) {
        return authenticationService.validatePhone(request);
    }

    @PostMapping("/auth/resend-email-validation")
    @Operation(tags = {"Authentication"}, summary = "Renvoyer un email de validation")
    public ResponseEntity<Map<String, String>> resendEmailValidation(@RequestBody ResendEmailValidationRequest request) {
        return authenticationService.resendEmailValidation(request);
    }

    @PostMapping("/private/auth/send-phone-code")
    @Operation(tags = {"Authentication"}, summary = "Envoyer un code pour valider le numéro de téléphone")
    public ResponseEntity<Map<String, String>> sendPhoneValidationCode() {
        return authenticationService.sendPhoneValidationCode();
    }

}
