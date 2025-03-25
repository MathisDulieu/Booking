package com.microservices.payment_service.dao;

import com.microservices.payment_service.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserDao {

    private final MongoTemplate mongoTemplate;

    private static final String USER_COLLECTION = "USERS";

    public boolean doesNotExists(String id) {
        Query query = new Query(Criteria.where("_id").is(id));
        return !mongoTemplate.exists(query, User.class, USER_COLLECTION);
    }

}
