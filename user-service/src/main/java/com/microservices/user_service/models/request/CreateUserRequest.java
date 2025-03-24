package com.microservices.user_service.models.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    private String username;
    private String email;
    private String phoneNumber;
    private String password;
    private String role;
    private boolean isValidatedEmail;
    private boolean isValidatedPhoneNumber;
}
