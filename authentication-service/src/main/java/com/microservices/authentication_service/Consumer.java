package com.microservices.authentication_service;

import com.microservices.authentication_service.services.EmailValidationService;
import com.microservices.authentication_service.services.LoginService;
import com.microservices.authentication_service.services.PhoneValidationService;
import com.microservices.authentication_service.services.RegistrationService;
import com.microservices.shared_models.models.dto.request.athentication.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.ExchangeTypes;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class Consumer {

    private final RegistrationService registrationService;
    private final LoginService loginService;
    private final EmailValidationService emailValidationService;
    private final PhoneValidationService phoneValidationService;

    @RabbitListener(
            bindings = @QueueBinding(
                    value = @Queue(value = "auth.queue", durable = "true"),
                    exchange = @Exchange(value = "auth-exchange", type = ExchangeTypes.TOPIC),
                    key = "auth.*"
            )
    )
    public Map<String, String> handleAuthRequest(Message message, Object request) {
        String routingKey = message.getMessageProperties().getReceivedRoutingKey();
        log.info("Received auth request with routing key: {}", routingKey);

        try {
            return switch (routingKey) {
                case "auth.register" -> registrationService.registerUser((RegisterRequest) request);
                case "auth.login" -> loginService.authenticateUser((LoginRequest) request);
                case "auth.validate-email" -> emailValidationService.validateEmail((ValidateEmailRequest) request);
                case "auth.validate-phone" -> phoneValidationService.validatePhone((ValidatePhoneRequest) request);
                case "auth.resend-email-validation" ->
                        emailValidationService.resendValidation((ResendEmailValidationRequest) request);
                case "auth.send-phone-code" -> phoneValidationService.sendValidationCode();
                default -> {
                    log.warn("Unknown routing key: {}", routingKey);
                    yield Map.of("error", "Unknown request type");
                }
            };
        } catch (ClassCastException e) {
            log.error("Invalid request format for routing key {}: {}", routingKey, e.getMessage());
            return Map.of("error", "Invalid request format");
        } catch (Exception e) {
            log.error("Error processing request with routing key {}: {}", routingKey, e.getMessage());
            return Map.of("error", e.getMessage());
        }
    }

}
