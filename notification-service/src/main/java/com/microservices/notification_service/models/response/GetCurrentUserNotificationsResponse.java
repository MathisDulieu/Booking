package com.microservices.notification_service.models.response;

import com.microservices.notification_service.models.Notification;
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
