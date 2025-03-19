package com.microservices.api_gateway.services;

import com.microservices.api_gateway.configurations.EnvConfiguration;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final EnvConfiguration envConfiguration;

    public ResponseEntity<Map<String, String>> register() {
        return null;
    }

    public ResponseEntity<Map<String, String>> login() {
        return null;
    }

    public ResponseEntity<Map<String, String>> getUserById() {
        return null;
    }

    public ResponseEntity<Map<String, String>> updateUser() {
        return null;
    }

    public ResponseEntity<Map<String, String>> getCurrentUserInfo() {
        return null;
    }

    public ResponseEntity<Map<String, String>> deleteCurrentUser() {
        return null;
    }

    public ResponseEntity<Map<String, String>> updateUsername() {
        return null;
    }

    public ResponseEntity<Map<String, String>> updateEmail() {
        return null;
    }

    public ResponseEntity<Map<String, String>> updatePhone() {
        return null;
    }

    public ResponseEntity<Map<String, String>> updatePassword() {
        return null;
    }

    public ResponseEntity<Map<String, String>> createUser() {
        return null;
    }

    public ResponseEntity<Map<String, String>> validateEmail() {
        return null;
    }

    public ResponseEntity<Map<String, String>> validatePhone() {
        return null;
    }

    public ResponseEntity<Map<String, String>> resendEmailValidation() {
        return null;
    }

    public ResponseEntity<Map<String, String>> sendPhoneValidationCode() {
        return null;
    }
}
