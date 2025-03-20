package com.microservices.authentication_service.services;

import com.microservices.shared_models.models.dto.request.athentication.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

import static java.util.Collections.singletonMap;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    public Map<String, String> registerUser(RegisterRequest request) {
        return singletonMap("message", "User successfully registered!");
    }

}
