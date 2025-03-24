package com.microservices.user_service.dao;

import com.microservices.user_service.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserDao {

    private final MongoTemplate mongoTemplate;

    private static final String USER_COLLECTION = "USERS";

    public Optional<User> findById(String userId) {
        return Optional.ofNullable(mongoTemplate.findById(userId, User.class, USER_COLLECTION));
    }

    public void delete(String userId) {
        mongoTemplate.remove(new Query(Criteria.where("_id").is(userId)), USER_COLLECTION);
    }

    public void save(User user) {
        mongoTemplate.save(user, USER_COLLECTION);
    }

    public boolean isUsernameAlreadyUsed(String username) {
        return mongoTemplate.exists(new Query(Criteria.where("username").is(username)), USER_COLLECTION);
    }

    public boolean isEmailAlreadyUsed(String email) {
        return mongoTemplate.exists(new Query(Criteria.where("email").is(email)), USER_COLLECTION);
    }

    public boolean isPhoneNumberAlreadyUsed(String phoneNumber) {
        return mongoTemplate.exists(new Query(Criteria.where("phoneNumber").is(phoneNumber)), USER_COLLECTION);
    }

}
