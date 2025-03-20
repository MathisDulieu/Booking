package com.microservices.api_gateway.services;

import com.microservices.api_gateway.Producer;
import com.microservices.api_gateway.configurations.EnvConfiguration;
import com.microservices.shared_models.models.dto.request.athentication.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

    private final EnvConfiguration envConfiguration;
    private final Producer producer;

    public ResponseEntity<Map<String, String>> login(LoginRequest request) {
        return null;
    }

    public ResponseEntity<Map<String, String>> register(RegisterRequest request) {
        try {
            Map<String, String> response = producer.sendAndReceive(
                    "auth-exchange",
                    "auth.register",
                    request,
                    Map.class
            );

            if (response == null) {
                return ResponseEntity.internalServerError()
                        .body(Map.of("error", "Aucune réponse reçue du service d'authentification"));
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erreur lors de l'enregistrement: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Erreur lors de l'enregistrement: " + e.getMessage()));
        }
    }

    public ResponseEntity<Map<String, String>> validateEmail(ValidateEmailRequest request) {
        return null;
    }

    public ResponseEntity<Map<String, String>> validatePhone(ValidatePhoneRequest request) {
        return null;
    }

    public ResponseEntity<Map<String, String>> resendEmailValidation(ResendEmailValidationRequest request) {
        return null;
    }

    public ResponseEntity<Map<String, String>> sendPhoneValidationCode() {
        return null;
    }
}
