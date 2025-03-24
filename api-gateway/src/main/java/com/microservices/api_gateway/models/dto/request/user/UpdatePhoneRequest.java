package com.microservices.api_gateway.models.dto.request.user;

import com.microservices.api_gateway.models.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePhoneRequest {
    private String phone;
    private User user;
}
