package com.microservices.user_service.models;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class User {

    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private String phoneNumber;
    private boolean isValidatedEmail;
    private boolean isValidatedPhoneNumber;

    private String phoneCode;
    private LocalDateTime phoneCodeValidity;

    @Builder.Default
    private NotificationPreferences notificationPreferences = NotificationPreferences.builder().build();

    @Builder.Default
    private UserRole role = UserRole.USER;

}
