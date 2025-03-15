package com.microservices.api_gateway.services;

import com.microservices.api_gateway.configuration.EnvConfiguration;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private EnvConfiguration envConfiguration;

    public ResponseEntity<Map<String, String>> sendConfirmationEmail() {
        return null;
    }

    public ResponseEntity<Map<String, String>> sendConfirmationSMS() {
        return null;
    }
}
