package com.microservices.user_service.models.request;

import com.microservices.user_service.models.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePasswordRequest {
    private String newPassword;
    private String oldPassword;
    private User user;
}