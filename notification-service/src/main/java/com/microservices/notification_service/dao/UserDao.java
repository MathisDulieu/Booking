package com.microservices.notification_service.dao;

import com.microservices.notification_service.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserDao {

    private final MongoTemplate mongoTemplate;

    private static final String USER_COLLECTION = "USERS";

    public void save(User user) {
        mongoTemplate.save(user, USER_COLLECTION);
    }

    public Optional<User> findById(String userId) {
        return Optional.ofNullable(mongoTemplate.findById(userId, User.class, USER_COLLECTION));
    }

}
