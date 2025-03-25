package com.microservices.api_gateway.models.dto.response.notification;

import com.microservices.api_gateway.models.Notification;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class GetCurrentUserNotificationsResponse {

    private List<Notification> notifications;
    private String error;

}
