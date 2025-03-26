package com.microservices.notification_service.dao;

import com.microservices.notification_service.models.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class NotificationDao {

    private final MongoTemplate mongoTemplate;

    private static final String NOTIFICATION_COLLECTION = "NOTIFICATIONS";

    public void save(Notification notification) {
        mongoTemplate.save(notification, NOTIFICATION_COLLECTION);
    }

    public List<Notification> getUserNotifications(String userId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("userId").is(userId));
        query.with(Sort.by(Sort.Direction.DESC, "sentAt"));
        query.limit(5);

        return mongoTemplate.find(query, Notification.class, NOTIFICATION_COLLECTION);
    }

}
