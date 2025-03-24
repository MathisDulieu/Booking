package com.microservices.user_service.models.request;

import com.microservices.user_service.models.NotificationPreferences;
import com.microservices.user_service.models.UserRole;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetCurrentUserInfoRequest {

    private String username;
    private String email;
    private String phoneNumber;
    private boolean isValidatedEmail;
    private boolean isValidatedPhoneNumber;
    private UserRole role;

}
