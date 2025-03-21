package com.microservices.api_gateway.services;

import com.microservices.api_gateway.configurations.EnvConfiguration;
import com.microservices.api_gateway.models.dto.request.authentication.*;
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
    private final com.microservices.api_gateway.services.Producer producer;

    public ResponseEntity<Map<String, String>> login(LoginRequest request) {
        return null;
    }

    public ResponseEntity<Map<String, String>> register(RegisterRequest request) {
        try {
            log.info("Tentative d'enregistrement d'un nouvel utilisateur: {}", request.getUsername());

            Map<String, String> response = producer.sendAndReceive(
                    "auth-exchange",
                    "auth.register",
                    request,
                    Map.class
            );

            if (response == null) {
                log.error("Aucune réponse reçue du service d'authentification");
                return ResponseEntity.internalServerError()
                        .body(Map.of("error", "Aucune réponse reçue du service d'authentification"));
            }

            if (response.containsKey("error")) {
                log.error("Le service d'authentification a retourné une erreur: {}", response.get("error"));
                return ResponseEntity.badRequest().body(response);
            }

            if (response.containsKey("warning")) {
                log.error("Le service d'authentification a retourné un warning: {}", response.get("warning"));
                return ResponseEntity.badRequest().body(response);
            }

            log.info("Utilisateur enregistré avec succès: {}", request.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erreur lors de l'enregistrement: ", e);
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
