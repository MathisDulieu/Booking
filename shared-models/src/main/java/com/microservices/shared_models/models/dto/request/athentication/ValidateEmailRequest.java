package com.microservices.shared_models.models.dto.request.athentication;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ValidateEmailRequest {
    private String token;
}
