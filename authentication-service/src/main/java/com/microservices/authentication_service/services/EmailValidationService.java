package com.microservices.authentication_service.services;

import com.microservices.shared_models.models.dto.request.athentication.RegisterRequest;
import com.microservices.shared_models.models.dto.request.athentication.ResendEmailValidationRequest;
import com.microservices.shared_models.models.dto.request.athentication.ValidateEmailRequest;
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
