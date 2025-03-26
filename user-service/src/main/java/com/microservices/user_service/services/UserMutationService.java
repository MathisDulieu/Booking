package com.microservices.user_service.services;

import com.microservices.user_service.UuidProvider;
import com.microservices.user_service.dao.UserDao;
import com.microservices.user_service.models.User;
import com.microservices.user_service.models.UserRole;
import com.microservices.user_service.models.request.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

import static java.util.Collections.singletonMap;
import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
public class UserMutationService {

    private final UserDao userDao;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UuidProvider uuidProvider;

    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
    private static final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}';:\",.<>?|`~])[A-Za-z\\d!@#$%^&*()_+\\-={}';:\",.<>?|`~]{8,}$";
    private static final String PHONE_REGEX = "^(?:(?:\\+|00)33|0)\\s*[1-9](?:[\\s.-]*\\d{2}){4}$";

    public Map<String, String> updateUsername(UpdateUsernameRequest updateUsernameRequest) {
        List<String> errors = new ArrayList<>();

        validateNewUsername(errors, updateUsernameRequest.getUsername(), updateUsernameRequest.getUser());

        if (!errors.isEmpty()) {
            return singletonMap("BAD_REQUEST", getErrorsAsString(errors));
        }

        userDao.save(updateUsernameRequest.getUser());

        return singletonMap("message", "Username updated successfully");
    }

    public Map<String, String> updateEmail(UpdateEmailRequest updateEmailRequest) {
        List<String> errors = new ArrayList<>();

        validateNewEmail(errors, updateEmailRequest.getEmail(), updateEmailRequest.getUser());

        if (!errors.isEmpty()) {
            return singletonMap("BAD_REQUEST", getErrorsAsString(errors));
        }

        userDao.save(updateEmailRequest.getUser());

        return singletonMap("message", "Email updated successfully");
    }

    public Map<String, String> updatePhone(UpdatePhoneRequest updatePhoneRequest) {
        List<String> errors = new ArrayList<>();

        validateNewPhone(errors, updatePhoneRequest.getPhone(), updatePhoneRequest.getUser());

        if (!errors.isEmpty()) {
            return singletonMap("BAD_REQUEST", getErrorsAsString(errors));
        }

        userDao.save(updatePhoneRequest.getUser());

        return singletonMap("message", "PhoneNumber updated successfully");
    }

    public Map<String, String> updatePassword(UpdatePasswordRequest updatePasswordRequest) {
        List<String> errors = new ArrayList<>();

        if (isNull(updatePasswordRequest.getOldPassword()) || isNull(updatePasswordRequest.getNewPassword())) {
            return singletonMap("BAD_REQUEST", "Old password and new password cannot be null!");
        }

        validateNewPassword(errors, updatePasswordRequest);

        if (!errors.isEmpty()) {
            return singletonMap("BAD_REQUEST", getErrorsAsString(errors));
        }

        userDao.save(updatePasswordRequest.getUser());

        return singletonMap("message", "Password updated successfully");
    }

    public Map<String, String> updateUser(UpdateUserRequest updateUserRequest) {
        Optional<User> optionalUser = userDao.findById(updateUserRequest.getUserId());
        if (optionalUser.isEmpty()) {
            return singletonMap("NOT_FOUND", "User not found");
        }

        User user = optionalUser.get();
        List<String> errors = new ArrayList<>();

        validateRequest(errors, updateUserRequest, user);

        if (!errors.isEmpty()) {
            return singletonMap("BAD_REQUEST", getErrorsAsString(errors));
        }

        userDao.save(user);

        return singletonMap("message", "User with id: " + updateUserRequest.getUserId() + " updated successfully");
    }

    public Map<String, String> createUser(CreateUserRequest createUserRequest) {
        UserRole role = getUserRole(createUserRequest.getRole());

        if (isNull(role)) {
            return singletonMap("BAD_REQUEST", "Invalid role: " + createUserRequest.getRole() + ". Allowed values are: " + Arrays.toString(UserRole.values()));
        }

        User user = buildUser(createUserRequest, role);

        List<String> errors = new ArrayList<>();

        validateRequest(errors, createUserRequest);

        if (!errors.isEmpty()) {
            return singletonMap("BAD_REQUEST", getErrorsAsString(errors));
        }

        userDao.save(user);

        return singletonMap("message", "User created successfully");
    }

    private UserRole getUserRole(String role) {
        try {
            return UserRole.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private User buildUser(CreateUserRequest request, UserRole role) {
        return User.builder()
                .id(uuidProvider.generateUuid())
                .password(request.getPassword())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .username(request.getUsername())
                .role(role)
                .isValidatedEmail(request.isValidatedEmail())
                .isValidatedPhoneNumber(request.isValidatedPhoneNumber())
                .build();
    }

    private void validateNewRole(List<String> errors, String role, User userToUpdate) {
        if (!isNull(role)) {
            if (role.equals(userToUpdate.getRole().toString())) {
                errors.add("The new role must be different from the current one");
            }

            try {
                UserRole newRole = UserRole.valueOf(role.toUpperCase());
                userToUpdate.setRole(newRole);
            } catch (IllegalArgumentException e) {
                errors.add("Invalid role: " + role + ". Allowed values are: " + Arrays.toString(UserRole.values()));
            }
        }
    }

    private void validateRequest(List<String> errors, CreateUserRequest request) {
        validateUsername(errors, request.getUsername());
        validatePhoneNumber(errors, request.getPhoneNumber());
        validateEmail(errors, request.getEmail());
        validatePassword(errors, request.getPassword());
    }

    private void validatePassword(List<String> errors, String password) {
        if (isInvalidPassword(password)) {
            errors.add("The password does not meet the required criteria.");
        }
    }

    private void validateEmail(List<String> errors, String email) {
        if (isInvalidEmail(email)) {
            errors.add("Invalid email format.");
        }

        if (userDao.isEmailAlreadyUsed(email)) {
            errors.add("This email is already used.");
        }
    }

    private void validatePhoneNumber(List<String> errors, String phoneNumber) {
        if (isInvalidPhoneNumber(phoneNumber)) {
            errors.add("Invalid phone number format.");
        }

        if (userDao.isPhoneNumberAlreadyUsed(phoneNumber)) {
            errors.add("This phone number is already used.");
        }
    }

    private void validateUsername(List<String> errors, String username) {
        if (isInvalidUsername(username)) {
            errors.add("Invalid username: Must be 3-11 characters and cannot contain spaces.");
        }

        if (userDao.isUsernameAlreadyUsed(username)) {
            errors.add("Username already taken: Please choose a different one.");
        }
    }

    private void validateRequest(List<String> errors, UpdateUserRequest request, User user) {
        if (isNull(request.getEmail()) && isNull(request.getUsername()) && isNull(request.getRole()) && isNull(request.getPhoneNumber())) {
            errors.add("No values provided for update. Please specify at least one field (email, username, phoneNumber or role)");
        }

        if (errors.isEmpty()) {
            if (!isNull(request.getUsername())) { validateNewUsername(errors, request.getUsername(), user); }
            if (!isNull(request.getEmail())) { validateNewEmail(errors, request.getEmail(), user); }
            if (!isNull(request.getRole())) { validateNewRole(errors, request.getRole(), user); }
            if (!isNull(request.getPhoneNumber())) { validateNewPhone(errors, request.getPhoneNumber(), user); }
        }
    }

    private void validateNewUsername(List<String> errors, String username, User userToUpdate) {
        if (isInvalidUsername(username)) {
            errors.add("Invalid username: Must be 3-11 characters and cannot contain spaces.");
        }

        if (userDao.isUsernameAlreadyUsed(username)) {
            errors.add("Username already taken: Please choose a different one.");
        }

        if (username.equals(userToUpdate.getUsername())) {
            errors.add("Username cannot be the same as the current one.");
        }

        userToUpdate.setUsername(username);
    }

    public boolean isInvalidUsername(String username) {
        return isNull(username) || username.length() < 3 || username.length() > 11 || username.contains(" ");
    }

    public String getErrorsAsString(List<String> errors) {
        return String.join(" | ", errors);
    }

    private void validateNewEmail(List<String> errors, String email, User userToUpdate) {
        if (isInvalidEmail(email)) {
            errors.add("Invalid email format.");
        }

        if (userDao.isEmailAlreadyUsed(email)) {
            errors.add("This email is already used.");
        }

        if (email.equals(userToUpdate.getEmail())) {
            errors.add("The new email address must be different from the current one.");
        }

        userToUpdate.setEmail(email);
    }

    public boolean isInvalidEmail(String email) {
        return isNull(email) || !Pattern.compile(EMAIL_REGEX).matcher(email).matches();
    }

    private void validateNewPhone(List<String> errors, String phoneNumber, User userToUpdate) {
        if (isInvalidPhoneNumber(phoneNumber)) {
            errors.add("Invalid phone number format.");
        }

        if (userDao.isPhoneNumberAlreadyUsed(phoneNumber)) {
            errors.add("This phone number is already used.");
        }

        userToUpdate.setPhoneNumber(phoneNumber);
    }

    private boolean isInvalidPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            return false;
        }

        return !Pattern.compile(PHONE_REGEX).matcher(phoneNumber).matches();
    }

    private void validateNewPassword(List<String> errors, UpdatePasswordRequest request) {
        if (isInvalidPassword(request.getNewPassword())) {
            errors.add("The new password does not meet the required criteria.");
        }

        if (passwordEncoder.matches(request.getNewPassword(), request.getUser().getPassword())) {
            errors.add("New password must be different from the old password.");
        }

        if (!passwordEncoder.matches(request.getOldPassword(), request.getUser().getPassword())) {
            errors.add("Old password is incorrect.");
        }

        request.getUser().setPassword(passwordEncoder.encode(request.getNewPassword()));
    }

    public boolean isInvalidPassword(String password) {
        return isNull(password) || !password.matches(PASSWORD_REGEX);
    }

}
