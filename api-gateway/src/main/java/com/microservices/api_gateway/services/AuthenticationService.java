package com.microservices.api_gateway.services;

import com.microservices.api_gateway.Producer;
import com.microservices.api_gateway.models.dto.request.authentication.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final Producer producer;
    private final ErrorResponseService errorResponseService;

    @SuppressWarnings("unchecked")
    private <T> ResponseEntity<Map<String, String>> sendAuthRequest(String routingKey, T request) {
        try {
            Map<String, String> response = producer.sendAndReceive(
                    "auth-exchange",
                    routingKey,
                    request,
                    Map.class
            );

            if (response == null) {
                return ResponseEntity.internalServerError()
                        .body(Map.of("error", "No response received from authentication service"));
            }

            return errorResponseService.mapToResponseEntity(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error communicating with authentication service: " + e.getMessage()));
        }
    }

    public ResponseEntity<Map<String, String>> login(LoginRequest request) {
        return sendAuthRequest("auth.login", request);
    }

    public ResponseEntity<Map<String, String>> register(RegisterRequest request) {
        return sendAuthRequest("auth.register", request);
    }

    public ResponseEntity<Map<String, String>> validateEmail(ValidateEmailRequest request) {
        return sendAuthRequest("auth.validateEmail", request);
    }

    public ResponseEntity<Map<String, String>> validatePhone(ValidatePhoneRequest request) {
        return sendAuthRequest("auth.validatePhone", request);
    }

    public ResponseEntity<Map<String, String>> resendEmailValidation(ResendEmailValidationRequest request) {
        return sendAuthRequest("auth.resendEmailValidation", request);
    }

    public ResponseEntity<Map<String, String>> sendPhoneValidationCode() {
        return sendAuthRequest("auth.sendPhoneValidation", Map.of());
    }
}