package com.microservices.user_service.models.response;

import com.microservices.user_service.models.NotificationPreferences;
import com.microservices.user_service.models.UserRole;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class GetCurrentUserInfoResponse {

    private String username;
    private String email;
    private String phoneNumber;
    private boolean isValidatedEmail;
    private boolean isValidatedPhoneNumber;
    private UserRole role;

    private String error;

}
