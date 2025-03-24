package com.microservices.api_gateway.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservices.api_gateway.Producer;
import com.microservices.api_gateway.configurations.EnvConfiguration;
import com.microservices.api_gateway.models.User;
import com.microservices.api_gateway.models.dto.request.user.*;
import com.microservices.api_gateway.models.dto.response.user.GetCurrentUserInfoResponse;
import com.microservices.api_gateway.models.dto.response.user.GetUserByIdResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

import static java.util.Collections.singletonMap;

@Service
@RequiredArgsConstructor
public class UserService {

    private final Producer producer;
    private final ErrorResponseService errorResponseService;

    private <T> ResponseEntity<Map<String, String>> sendUserRequest(String routingKey, T request) {
        try {
            Map<String, String> response = producer.sendAndReceive(
                    "user-exchange",
                    routingKey,
                    request,
                    Map.class
            );

            if (response == null) {
                return ResponseEntity.internalServerError()
                        .body(Map.of("error", "Aucune réponse reçue du service utilisateur"));
            }

            return errorResponseService.mapToResponseEntity(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Erreur lors de la communication avec le service utilisateur : " + e.getMessage()));
        }
    }

    public <T, R> ResponseEntity<Map<String, R>> sendAndProcessUserRequest(String endpoint, T request, Class<R> responseClass) throws JsonProcessingException {
        ResponseEntity<Map<String, String>> response = sendUserRequest(endpoint, request);
        HttpStatusCode status = response.getStatusCode();
        Map<String, String> responseBody = response.getBody();
        String key = responseBody.keySet().iterator().next();
        String jsonValue = responseBody.get(key);
        ObjectMapper objectMapper = new ObjectMapper();
        R userResponse = objectMapper.readValue(jsonValue, responseClass);
        Map<String, R> result = singletonMap(key, userResponse);
        return ResponseEntity.status(status).body(result);
    }

    public ResponseEntity<Map<String, GetUserByIdResponse>> getUserById(String userId) throws JsonProcessingException {
        GetUserByIdRequest request = new GetUserByIdRequest(userId);
        return sendAndProcessUserRequest("user.getUserById", request, GetUserByIdResponse.class);
    }

    public ResponseEntity<Map<String, String>> updateUser(UpdateUserRequest request) {
        return sendUserRequest("user.updateUser", request);
    }

    public ResponseEntity<Map<String, GetCurrentUserInfoResponse>> getCurrentUserInfo(User user) throws JsonProcessingException {
        GetCurrentUserInfoRequest request = buildGetCurrentUserInfoRequest(user);
        return sendAndProcessUserRequest("user.getAuthenticatedUser", request, GetCurrentUserInfoResponse.class);
    }

    public ResponseEntity<Map<String, String>> deleteCurrentUser(User user) {
        DeleteCurrentUserRequest request = new DeleteCurrentUserRequest(user.getId());
        return sendUserRequest("user.deleteCurrentUser", request);
    }

    public ResponseEntity<Map<String, String>> updateUsername(UpdateUsernameRequest request, User user) {
        request.setUser(user);
        return sendUserRequest("user.updateUsername", request);
    }

    public ResponseEntity<Map<String, String>> updateEmail(UpdateEmailRequest request, User user) {
        request.setUser(user);
        return sendUserRequest("user.updateEmail", request);
    }

    public ResponseEntity<Map<String, String>> updatePhone(UpdatePhoneRequest request, User user) {
        request.setUser(user);
        return sendUserRequest("user.updatePhone", request);
    }

    public ResponseEntity<Map<String, String>> updatePassword(UpdatePasswordRequest request, User user) {
        request.setUser(user);
        return sendUserRequest("user.updatePassword", request);
    }

    public ResponseEntity<Map<String, String>> createUser(CreateUserRequest request) {
        return sendUserRequest("user.createUser", request);
    }

    private GetCurrentUserInfoRequest buildGetCurrentUserInfoRequest(User user) {
        GetCurrentUserInfoRequest getCurrentUserInfoRequest = new GetCurrentUserInfoRequest();
        getCurrentUserInfoRequest.setUsername(user.getUsername());
        getCurrentUserInfoRequest.setEmail(user.getEmail());
        getCurrentUserInfoRequest.setRole(user.getRole());
        getCurrentUserInfoRequest.setPhoneNumber(user.getPhoneNumber());
        getCurrentUserInfoRequest.setValidatedEmail(user.isValidatedEmail());
        getCurrentUserInfoRequest.setValidatedPhoneNumber(user.isValidatedPhoneNumber());

        return getCurrentUserInfoRequest;
    }

}
