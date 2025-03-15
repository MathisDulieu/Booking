package com.microservices.api_gateway.services;

import com.microservices.api_gateway.configuration.EnvConfiguration;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private EnvConfiguration envConfiguration;

    public ResponseEntity<Map<String, String>> register() {
        return null;
    }

    public ResponseEntity<Map<String, String>> login() {
        return null;
    }

    public ResponseEntity<Map<String, String>> getUserById() {
        return null;
    }

    public ResponseEntity<Map<String, String>> getAuthenticatedUser() {
        return null;
    }

    public ResponseEntity<Map<String, String>> updateUser() {
        return null;
    }

    public ResponseEntity<Map<String, String>> deleteUser() {
        return null;
    }
}
