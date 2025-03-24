package com.microservices.user_service.services;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.microservices.user_service.dao.UserDao;
import com.microservices.user_service.models.User;
import com.microservices.user_service.models.UserRole;
import com.microservices.user_service.models.request.GetCurrentUserInfoRequest;
import com.microservices.user_service.models.request.GetUserByIdRequest;
import com.microservices.user_service.models.response.GetCurrentUserInfoResponse;
import com.microservices.user_service.models.response.GetUserByIdResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

import static java.util.Collections.singletonMap;

@Service
@RequiredArgsConstructor
public class UserQueryService {

    private final UserDao userDao;

    public Map<String, String> getUserById(GetUserByIdRequest request) throws JsonProcessingException {
        Optional<User> optionalUser = userDao.findById(request.getUserId());
        GetUserByIdResponse response = GetUserByIdResponse.builder().build();

        if (optionalUser.isEmpty()) {
            response.setError("User not found");
            return singletonMap("NOT_FOUND", convertObjectToJsonString(response));
        }

        User user = optionalUser.get();
        if (user.getRole().equals(UserRole.ADMIN)) {
            response.setError("Admin users cannot be retrieved");
            return singletonMap("FORBIDDEN", convertObjectToJsonString(response));
        }

        buildGetUserByIdResponse(response, user);

        return singletonMap("informations", convertObjectToJsonString(response));
    }

    public Map<String, String> getCurrentUserInfo(GetCurrentUserInfoRequest request) throws JsonProcessingException {
        GetCurrentUserInfoResponse authenticatedUserResponse = GetCurrentUserInfoResponse.builder()
                .username(request.getUsername())
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .email(request.getEmail())
                .isValidatedEmail(request.isValidatedEmail())
                .isValidatedPhoneNumber(request.isValidatedPhoneNumber())
                .build();

        return singletonMap("informations", convertObjectToJsonString(authenticatedUserResponse));
    }

    private void buildGetUserByIdResponse(GetUserByIdResponse response, User user) {
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setUsername(user.getUsername());
        response.setValidatedEmail(user.isValidatedEmail());
        response.setValidatedPhoneNumber(user.isValidatedPhoneNumber());
        response.setPhoneNumber(user.getPhoneNumber());
    }

    private String convertObjectToJsonString(Object object) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();

        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectMapper.registerModule(new JavaTimeModule());

        return objectMapper.writeValueAsString(object);
    }

}
