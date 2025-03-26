package com.microservices.authentication_service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservices.authentication_service.models.request.*;
import com.microservices.authentication_service.services.EmailValidationService;
import com.microservices.authentication_service.services.LoginService;
import com.microservices.authentication_service.services.PhoneValidationService;
import com.microservices.authentication_service.services.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.ExchangeTypes;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class Consumer {

    private final RegistrationService registrationService;
    private final LoginService loginService;
    private final EmailValidationService emailValidationService;
    private final PhoneValidationService phoneValidationService;
    private final ObjectMapper objectMapper;

    @RabbitListener(
            bindings = @QueueBinding(
                    value = @Queue(value = "auth.queue", durable = "true"),
                    exchange = @Exchange(value = "auth-exchange", type = ExchangeTypes.TOPIC),
                    key = "auth.*"
            )
    )
    public String handleAuthRequest(String payload, Message message) {
        String routingKey = message.getMessageProperties().getReceivedRoutingKey();

        try {
            Map<String, String> result = switch (routingKey) {
                case "auth.register" -> {
                    RegisterRequest registerRequest = objectMapper.readValue(payload, RegisterRequest.class);
                    yield registrationService.registerUser(registerRequest);
                }
                case "auth.login" -> {
                    LoginRequest loginRequest = objectMapper.readValue(payload, LoginRequest.class);
                    yield loginService.authenticateUser(loginRequest);
                }
                case "auth.validateEmail" -> {
                    ValidateEmailRequest validateEmailRequest = objectMapper.readValue(payload, ValidateEmailRequest.class);
                    yield emailValidationService.validateEmail(validateEmailRequest);
                }
                case "auth.resendEmailValidation" -> {
                    ResendEmailValidationRequest resendEmailValidationRequest = objectMapper.readValue(payload, ResendEmailValidationRequest.class);
                    yield emailValidationService.resendValidation(resendEmailValidationRequest);
                }
                case "auth.validatePhone" -> {
                    ValidatePhoneRequest validatePhoneRequest = objectMapper.readValue(payload, ValidatePhoneRequest.class);
                    yield phoneValidationService.validatePhone(validatePhoneRequest);
                }
                case "auth.sendPhoneValidation" -> phoneValidationService.sendValidationCode();
                default -> throw new IllegalStateException("Unexpected value: " + routingKey);
            };

            return objectMapper.writeValueAsString(result);
        } catch (Exception e) {
            try {
                return objectMapper.writeValueAsString(Map.of("error", e.getMessage()));
            } catch (JsonProcessingException ex) {
                return "{\"error\": \"Internal server error\"}";
            }
        }
    }
}
