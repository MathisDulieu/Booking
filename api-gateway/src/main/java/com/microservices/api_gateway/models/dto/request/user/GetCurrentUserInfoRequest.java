package com.microservices.api_gateway.models.dto.request.user;

import com.microservices.api_gateway.models.enums.UserRole;
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
