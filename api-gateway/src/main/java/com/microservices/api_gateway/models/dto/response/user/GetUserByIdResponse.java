package com.microservices.api_gateway.models.dto.response.user;

import com.microservices.api_gateway.models.NotificationPreferences;
import com.microservices.api_gateway.models.enums.UserRole;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class GetUserByIdResponse {

    @Id
    private String id;
    private String username;
    private String email;
    private String phoneNumber;
    private boolean isValidatedEmail;
    private boolean isValidatedPhoneNumber;

    private String error;

}
