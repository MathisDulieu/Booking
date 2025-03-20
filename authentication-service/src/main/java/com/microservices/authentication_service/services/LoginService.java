package com.microservices.authentication_service.services;

import com.microservices.shared_models.models.dto.request.athentication.LoginRequest;
import com.microservices.shared_models.models.dto.request.athentication.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class LoginService {

    public Map<String, String> authenticateUser(LoginRequest request) {
        return null;
    }

}
