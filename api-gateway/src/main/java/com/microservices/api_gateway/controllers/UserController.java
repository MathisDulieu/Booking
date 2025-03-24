package com.microservices.api_gateway.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.microservices.api_gateway.models.User;
import com.microservices.api_gateway.models.dto.request.user.*;
import com.microservices.api_gateway.models.dto.response.user.GetCurrentUserInfoResponse;
import com.microservices.api_gateway.models.dto.response.user.GetUserByIdResponse;
import com.microservices.api_gateway.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/private/user")
    @Operation(
            tags = {"User"},
            summary = "Récupérer les informations de l'utilisateur connecté",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, GetCurrentUserInfoResponse>> getCurrentUser(
            @AuthenticationPrincipal User authenticatedUser
    ) throws JsonProcessingException {
        return userService.getCurrentUserInfo(authenticatedUser);
    }

    @DeleteMapping("/private/user")
    @Operation(
            tags = {"User"},
            summary = "Supprimer son compte",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, String>> deleteAccount(
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return userService.deleteCurrentUser(authenticatedUser);
    }

    @PutMapping("/private/user/username")
    @Operation(
            tags = {"User"},
            summary = "Update son nom d'utilisateur",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, String>> updateUsername(
            @AuthenticationPrincipal User authenticatedUser,
            @RequestBody UpdateUsernameRequest request
    ) {
        return userService.updateUsername(request, authenticatedUser);
    }

    @PutMapping("/private/user/email")
    @Operation(
            tags = {"User"},
            summary = "Update son email",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, String>> updateEmail(
            @AuthenticationPrincipal User authenticatedUser,
            @RequestBody UpdateEmailRequest request
    ) {
        return userService.updateEmail(request, authenticatedUser);
    }

    @PutMapping("/private/user/phone")
    @Operation(
            tags = {"User"},
            summary = "Update son numéro de téléphone",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, String>> updatePhone(
            @AuthenticationPrincipal User authenticatedUser,
            @RequestBody UpdatePhoneRequest request
    ) {
        return userService.updatePhone(request, authenticatedUser);
    }

    @PutMapping("/private/user/password")
    @Operation(
            tags = {"User"},
            summary = "Update son mot de passe",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, String>> updatePassword(
            @AuthenticationPrincipal User authenticatedUser,
            @RequestBody UpdatePasswordRequest request
    ) {
        return userService.updatePassword(request, authenticatedUser);
    }

    @GetMapping("/private/admin/user/{id}")
    @Operation(
            tags = {"User"},
            summary = "Récupérer un utilisateur par son id",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, GetUserByIdResponse>> getUserById(@PathVariable("id") String userId) throws JsonProcessingException {
        return userService.getUserById(userId);
    }

    @PutMapping("/private/admin/user/")
    @Operation(
            tags = {"User"},
            summary = "Update un utilisateur par son id",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, String>> updateUser(
            @RequestBody UpdateUserRequest request
    ) {
        return userService.updateUser(request);
    }

    @PostMapping("/private/admin/user")
    @Operation(
            tags = {"User"},
            summary = "Créer un utilisateur",
            security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Map<String, String>> createUser(
            @RequestBody CreateUserRequest request
    ) {
        return userService.createUser(request);
    }

}
