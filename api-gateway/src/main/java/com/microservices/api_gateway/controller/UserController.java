package com.microservices.api_gateway.controller;

import com.microservices.api_gateway.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @Operation(tags = {"User"})
    public ResponseEntity<Map<String, String>> register() {
        return userService.register();
    }

    @PostMapping("/login")
    @Operation(tags = {"User"})
    public ResponseEntity<Map<String, String>> login() {
        return userService.login();
    }

    @GetMapping("/{id}")
    @Operation(tags = {"User"})
    public ResponseEntity<Map<String, String>> getUserById() {
        return userService.getUserById();
    }

    @GetMapping
    @Operation(tags = {"User"})
    public ResponseEntity<Map<String, String>> getAuthenticatedUser() {
        return userService.getAuthenticatedUser();
    }

    @PutMapping("/{id}")
    @Operation(tags = {"User"})
    public ResponseEntity<Map<String, String>> updateUser() {
        return userService.updateUser();
    }

    @DeleteMapping("/{id}")
    @Operation(tags = {"User"})
    public ResponseEntity<Map<String, String>> deleteUser() {
        return userService.deleteUser();
    }

}
