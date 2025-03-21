package com.microservices.authentication_service.services;

import com.microservices.authentication_service.models.request.ResendEmailValidationRequest;
import com.microservices.authentication_service.models.request.ValidateEmailRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailValidationService {

    public Map<String, String> validateEmail(ValidateEmailRequest request) {
        return null;
    }

    public Map<String, String> resendValidation(ResendEmailValidationRequest request) {
        return null;
    }

}
