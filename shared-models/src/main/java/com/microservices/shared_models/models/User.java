package com.microservices.shared_models.models;

import com.microservices.shared_models.models.enums.UserRole;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.HashSet;

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