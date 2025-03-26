package com.microservices.user_service.models.request;

import com.microservices.user_service.models.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
