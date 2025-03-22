package com.microservices.authentication_service.services;

import com.microservices.authentication_service.UuidProvider;
import com.microservices.authentication_service.configuration.EnvConfiguration;
import com.microservices.authentication_service.dao.UserDao;
import com.microservices.authentication_service.models.User;
import com.microservices.authentication_service.models.request.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.regex.Pattern;

import static java.util.Collections.singletonMap;
import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final UuidProvider uuidProvider;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserDao userDao;
    private final EnvConfiguration envConfiguration;
    private final EmailService emailService;
    private final JwtTokenService jwtTokenService;

    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
    private static final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}';:\",.<>?|`~])[A-Za-z\\d!@#$%^&*()_+\\-={}';:\",.<>?|`~]{8,}$";
    private static final String PHONE_REGEX = "^(?:(?:\\+|00)33|0)\\s*[1-9](?:[\\s.-]*\\d{2}){4}$";

    public Map<String, String> registerUser(RegisterRequest request) {
        User user = buildUser(request);

        String error = getValidationError(user);
        if (!isNull(error)) {
            return singletonMap("BAD_REQUEST", error);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userDao.save(user);

        error = sendRegisterConfirmationEmail(user);
        if (!isNull(error)) {
            return singletonMap("warning", error);
        }

        return singletonMap("message", "User successfully registered!");
    }

    private User buildUser(RegisterRequest request) {
        return User.builder()
                .id(uuidProvider.generateUuid())
                .password(request.getPassword())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .username(request.getUsername())
                .build();
    }

    private String sendRegisterConfirmationEmail(User user) {
        String emailConfirmationToken = jwtTokenService.generateEmailConfirmationToken(user.getId());

        String body = getRegisterConfirmationEmailBody(emailConfirmationToken, user.getUsername());

        try {
            emailService.sendEmail(user.getEmail(), "Confirmez votre inscription à EventHub", body);
        } catch (MailException e) {
            return "Failed to send the registration confirmation email. Please try again later.";
        }

        return null;
    }

    private String getRegisterConfirmationEmailBody(String emailConfirmationToken, String username) {
        String confirmationLink = envConfiguration.getMailRegisterConfirmationLink() + emailConfirmationToken;

        return "<html>"
                + "<body>"
                + "<h2>Bienvenue " + username + " !</h2>"
                + "<p>Merci de vous être inscrit sur notre application.</p>"
                + "<p>Pour activer votre compte, veuillez cliquer sur le lien suivant :</p>"
                + "<p><a href=\"" + confirmationLink + "\">Confirmer mon email</a></p>"
                + "<p>Si vous n'avez pas créé de compte, veuillez ignorer cet email.</p>"
                + "</body>"
                + "</html>";
    }

    private String getValidationError(User user) {
        if (isInvalidEmail(user.getEmail())) {
            return "The provided email is not valid.";
        }
        if (isInvalidUsername(user.getUsername())) {
            return "The username must be between 3 and 11 characters long and must not contain spaces.";
        }
        if (isInvalidPassword(user.getPassword())) {
            return "The password does not meet the required criteria.";
        }
        if (userDao.isEmailAlreadyUsed(user.getEmail())) {
            return "A user with this email already exists.";
        }
        if (userDao.isUsernameAlreadyUsed(user.getUsername())) {
            return "A user with this username already exists.";
        }
        if (isInvalidPhoneNumber(user.getPhoneNumber())) {
            return "The phone number is not a valid phone number.";
        }

        return null;
    }

    private boolean isInvalidEmail(String email) {
        return isNull(email) || !Pattern.compile(EMAIL_REGEX).matcher(email).matches();
    }

    private boolean isInvalidUsername(String username) {
        return isNull(username) || username.length() < 3 || username.length() > 11 || username.contains(" ");
    }

    private boolean isInvalidPassword(String password) {
        return isNull(password) || !password.matches(PASSWORD_REGEX);
    }

    private boolean isInvalidPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            return false;
        }

        return !Pattern.compile(PHONE_REGEX).matcher(phoneNumber).matches();
    }

}
