package com.microservices.payment_service.models;

import com.microservices.payment_service.models.enums.UserRole;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

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

    @Builder.Default
    private NotificationPreferences notificationPreferences = NotificationPreferences.builder().build();

    @Builder.Default
    private UserRole role = UserRole.USER;

}