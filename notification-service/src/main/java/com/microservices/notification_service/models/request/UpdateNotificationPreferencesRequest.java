package com.microservices.notification_service.models.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateNotificationPreferencesRequest {
    private String userId;
    private boolean sms;
    private boolean email;
}
