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

    @PostMapping("/user/login")
    @Operation(tags = {"User"}, summary = "Login")
    public ResponseEntity<Map<String, String>> login() {
        return userService.login();
    }

    @PostMapping("/user/register")
    @Operation(tags = {"User"}, summary = "Register")
    public ResponseEntity<Map<String, String>> register() {
        return userService.register();
    }

    @PostMapping("/user/validate-email")
    @Operation(tags = {"User"}, summary = "Valider l'email")
    public ResponseEntity<Map<String, String>> validateEmail() {
        return userService.validateEmail();
    }

    @PostMapping("/private/user/validate-phone")
    @Operation(tags = {"User"}, summary = "Valider le numéro de téléphone")
    public ResponseEntity<Map<String, String>> validatePhone() {
        return userService.validatePhone();
    }

    @PostMapping("/user/resend-email-validation")
    @Operation(tags = {"User"}, summary = "Renvoyer un email de validation")
    public ResponseEntity<Map<String, String>> resendEmailValidation() {
        return userService.resendEmailValidation();
    }

    @PostMapping("/user/send-phone-code")
    @Operation(tags = {"User"}, summary = "Envoyer un code pour valider le numéro de téléphone")
    public ResponseEntity<Map<String, String>> sendPhoneValidationCode() {
        return userService.sendPhoneValidationCode();
    }
}
