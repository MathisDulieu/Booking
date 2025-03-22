package com.microservices.authentication_service.services;

import com.microservices.authentication_service.dao.UserDao;
import com.microservices.authentication_service.models.User;
import com.microservices.authentication_service.models.request.LoginRequest;
import com.microservices.authentication_service.models.request.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

import static java.util.Collections.singletonMap;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final UserDao userDao;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    public Map<String, String> authenticateUser(LoginRequest request) {
        Optional<User> optionalUser = userDao.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return singletonMap("NOT_FOUND", "User not found");
        }

        User user = optionalUser.get();

        if(!user.isValidatedEmail()) {
            return singletonMap("FORBIDDEN", "Email is not verified");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return singletonMap("UNAUTHORIZED", "Invalid password");
        }

        return singletonMap("authToken", jwtTokenService.generateToken(user.getId()));
    }

}
