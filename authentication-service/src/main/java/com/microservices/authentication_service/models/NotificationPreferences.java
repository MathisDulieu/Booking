package com.microservices.authentication_service.models;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class NotificationPreferences {
    private boolean email;
    private boolean sms;
}
