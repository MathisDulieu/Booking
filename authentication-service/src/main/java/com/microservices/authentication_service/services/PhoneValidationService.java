package com.microservices.authentication_service.services;

import com.microservices.authentication_service.models.request.ValidatePhoneRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PhoneValidationService {

    public Map<String, String> validatePhone(ValidatePhoneRequest request) {
        return null;
    }

    public Map<String, String> sendValidationCode() {
        return null;
    }

}
