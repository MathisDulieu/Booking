package com.microservices.notification_service.models;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class Notification {

    @Id
    private String id;
    private String userId;
    private NotificationType type;
    private String subject;
    private String content;
    private boolean isSentBySMS;
    private boolean isSentByEmail;

    @Builder.Default
    private LocalDateTime sentAt = LocalDateTime.now();

}
