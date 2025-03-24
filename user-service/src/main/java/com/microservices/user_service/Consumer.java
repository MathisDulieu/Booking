package com.microservices.user_service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservices.user_service.models.request.*;
import com.microservices.user_service.services.UserDeletionService;
import com.microservices.user_service.services.UserMutationService;
import com.microservices.user_service.services.UserQueryService;
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

    private final UserDeletionService userDeletionService;
    private final UserMutationService userMutationService;
    private final UserQueryService userQueryService;
    private final ObjectMapper objectMapper;

    @RabbitListener(
            bindings = @QueueBinding(
                    value = @Queue(value = "user.queue", durable = "true"),
                    exchange = @Exchange(value = "user-exchange", type = ExchangeTypes.TOPIC),
                    key = "user.*"
            )
    )
    public String handleAuthRequest(String payload, Message message) {
        String routingKey = message.getMessageProperties().getReceivedRoutingKey();

        try {
            Map<String, String> result = switch (routingKey) {
                case "user.getUserById" -> {
                    GetUserByIdRequest getUserByIdRequest = objectMapper.readValue(payload, GetUserByIdRequest.class);
                    yield userQueryService.getUserById(getUserByIdRequest);
                }
                case "user.getAuthenticatedUser" -> {
                    GetCurrentUserInfoRequest getCurrentUserInfoRequest = objectMapper.readValue(payload, GetCurrentUserInfoRequest.class);
                    yield userQueryService.getCurrentUserInfo(getCurrentUserInfoRequest);
                }
                case "user.deleteCurrentUser" -> {
                    DeleteCurrentUserRequest deleteCurrentUserRequest = objectMapper.readValue(payload, DeleteCurrentUserRequest.class);
                    yield userDeletionService.deleteCurrentUser(deleteCurrentUserRequest);
                }
                case "user.updateUsername" -> {
                    UpdateUsernameRequest updateUsernameRequest = objectMapper.readValue(payload, UpdateUsernameRequest.class);
                    yield userMutationService.updateUsername(updateUsernameRequest);
                }
                case "user.updateEmail" -> {
                    UpdateEmailRequest updateEmailRequest = objectMapper.readValue(payload, UpdateEmailRequest.class);
                    yield userMutationService.updateEmail(updateEmailRequest);
                }
                case "user.updatePhone" -> {
                    UpdatePhoneRequest updatePhoneRequest = objectMapper.readValue(payload, UpdatePhoneRequest.class);
                    yield userMutationService.updatePhone(updatePhoneRequest);
                }
                case "user.updatePassword" -> {
                    UpdatePasswordRequest updatePasswordRequest = objectMapper.readValue(payload, UpdatePasswordRequest.class);
                    yield userMutationService.updatePassword(updatePasswordRequest);
                }
                case "user.updateUser" -> {
                    UpdateUserRequest updateUserRequest = objectMapper.readValue(payload, UpdateUserRequest.class);
                    yield userMutationService.updateUser(updateUserRequest);
                }
                case "user.createUser" -> {
                    CreateUserRequest createUserRequest = objectMapper.readValue(payload, CreateUserRequest.class);
                    yield userMutationService.createUser(createUserRequest);
                }
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