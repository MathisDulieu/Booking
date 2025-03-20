package com.microservices.shared_models.models;

import com.microservices.shared_models.models.enums.EventType;
import com.microservices.shared_models.models.enums.NotificationType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

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