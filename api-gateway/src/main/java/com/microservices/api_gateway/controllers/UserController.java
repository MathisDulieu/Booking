package com.microservices.api_gateway.controllers;

import com.microservices.api_gateway.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/private/user")
    @Operation(tags = {"User"}, summary = "Récupérer les informations de l'utilisateur connecté")
    public ResponseEntity<Map<String, String>> getCurrentUser() {
        return userService.getCurrentUserInfo();
    }

    @DeleteMapping("/private/user")
    @Operation(tags = {"User"}, summary = "Supprimer son compte")
    public ResponseEntity<Map<String, String>> deleteAccount() {
        return userService.deleteCurrentUser();
    }

    @PutMapping("/private/user/username")
    @Operation(tags = {"User"}, summary = "Update son nom d'utilisateur")
    public ResponseEntity<Map<String, String>> updateUsername() {
        return userService.updateUsername();
    }

    @PutMapping("/private/user/email")
    @Operation(tags = {"User"}, summary = "Update son email")
    public ResponseEntity<Map<String, String>> updateEmail() {
        return userService.updateEmail();
    }

    @PutMapping("/private/user/phone")
    @Operation(tags = {"User"}, summary = "Update son numéro de téléphone")
    public ResponseEntity<Map<String, String>> updatePhone() {
        return userService.updatePhone();
    }

    @PutMapping("/private/user/password")
    @Operation(tags = {"User"}, summary = "Update son mot de passe")
    public ResponseEntity<Map<String, String>> updatePassword() {
        return userService.updatePassword();
    }

    @GetMapping("/private/admin/user/{id}")
    @Operation(tags = {"User"}, summary = "Récupérer un utilisateur par son id")
    public ResponseEntity<Map<String, String>> getUserById() {
        return userService.getUserById();
    }

    @PutMapping("/private/admin/user/{id}")
    @Operation(tags = {"User"}, summary = "Update un utilisateur par son id")
    public ResponseEntity<Map<String, String>> updateUser() {
        return userService.updateUser();
    }

    @PostMapping("/private/admin/user")
    @Operation(tags = {"User"}, summary = "Créer un utilisateur")
    public ResponseEntity<Map<String, String>> createUser() {
        return userService.createUser();
    }

}
