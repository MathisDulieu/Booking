package com.microservices.authentication_service.services;

import com.microservices.authentication_service.dao.UserDao;
import com.microservices.authentication_service.models.User;
import com.microservices.authentication_service.models.request.LoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

import static java.util.Collections.singletonMap;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final UserDao userDao;

    public Map<String, String> authenticateUser(LoginRequest request) {
        Optional<User> optionalUser = userDao.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return singletonMap("error", "User not found");
        }

        User user = optionalUser.get();

        if(!user.getIsValidEmail()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(singletonMap("error", "Email is not verified"));
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(singletonMap("error", "Invalid password"));
        }

        return ResponseEntity.ok(singletonMap("token", jwtTokenService.generateToken(user.getId())));
    }

}
