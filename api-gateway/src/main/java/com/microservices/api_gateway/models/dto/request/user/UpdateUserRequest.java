package com.microservices.api_gateway.models.dto.request.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String userId;
    private String username;
    private String email;
    private String phoneNumber;
    private String role;
}
