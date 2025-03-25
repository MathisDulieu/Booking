package com.microservices.notification_service.models.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendNotificationRequest {

    private String userId;
    private String type;
    private String subject;
    private String content;
    private boolean isSentBySMS;
    private boolean isSentByEmail;

}
