package com.microservices.api_gateway.models.dto.response.user;

import com.microservices.api_gateway.models.NotificationPreferences;
import com.microservices.api_gateway.models.enums.UserRole;
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