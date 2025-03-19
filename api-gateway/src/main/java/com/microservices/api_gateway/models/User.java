package com.microservices.api_gateway.models;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

@Getter
@Setter
@EqualsAndHashCode
public class User {
    private String id;
    private String username;
    private String email;
    private String phoneNumber;
    private boolean isValidEmail;
    private boolean isValidPhoneNumber;
    private String password;
    private String profileImageUrl;
    private String role;
}
