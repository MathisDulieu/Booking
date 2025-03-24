package com.microservices.user_service.services;

import com.microservices.user_service.dao.UserDao;
import com.microservices.user_service.models.request.DeleteCurrentUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

import static java.util.Collections.singletonMap;

@Service
@RequiredArgsConstructor
public class UserDeletionService {

    private final UserDao userDao;

    public Map<String, String> deleteCurrentUser(DeleteCurrentUserRequest request) {
        userDao.delete(request.getUserId());

        return singletonMap("message", "User deleted successfully");
    }

}
