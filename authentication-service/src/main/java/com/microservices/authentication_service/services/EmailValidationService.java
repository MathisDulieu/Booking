package com.microservices.authentication_service.services;

import com.microservices.authentication_service.configuration.EnvConfiguration;
import com.microservices.authentication_service.dao.UserDao;
import com.microservices.authentication_service.models.User;
import com.microservices.authentication_service.models.request.ResendEmailValidationRequest;
import com.microservices.authentication_service.models.request.ValidateEmailRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

import static java.util.Collections.singletonMap;
import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
public class EmailValidationService {

    private final JwtTokenService jwtTokenService;
    private final UserDao userDao;
    private final EmailService emailService;
    private final EnvConfiguration envConfiguration;

    public Map<String, String> validateEmail(ValidateEmailRequest request) {
        boolean isTokenValid = jwtTokenService.isEmailTokenValid(request.getToken());
        if (!isTokenValid) {
            return singletonMap("BAD_REQUEST", "Invalid or expired token");
        }

        String userId = jwtTokenService.resolveUserIdFromToken(request.getToken());
        Optional<User> optionalUser = userDao.findById(userId);
        if (optionalUser.isEmpty()) {
            return singletonMap("NOT_FOUND", "User not found");
        }

        User user = optionalUser.get();
        if (user.isValidatedEmail()) {
            return singletonMap("BAD_REQUEST", "Email already validated");
        }

        user.setValidatedEmail(true);
        userDao.save(user);

        return singletonMap("message", "Email successfully validated");
    }

    public Map<String, String> resendValidation(ResendEmailValidationRequest request) {
        Optional<User> optionalUser = userDao.findByEmail(request.getEmail());
        if (optionalUser.isEmpty()) {
            return singletonMap("NOT_FOUND", "User not found");
        }

        User user = optionalUser.get();
        if (user.isValidatedEmail()) {
            return singletonMap("BAD_REQUEST", "Email already validated");
        }

        String error = sendRegisterConfirmationEmail(user);
        if (!isNull(error)) {
            return singletonMap("INTERNAL_SERVER_ERROR", error);
        }

        return singletonMap("message", "Confirmation email successfully sent");
    }

    private String sendRegisterConfirmationEmail(User user) {
        String emailConfirmationToken = jwtTokenService.generateEmailConfirmationToken(user.getId());

        String body = getRegisterConfirmationEmailBody(emailConfirmationToken, user.getUsername());

        try {
            emailService.sendEmail(user.getEmail(), "Confirm your EventHub registration", body);
        } catch (MailException e) {
            return "Failed to send the registration confirmation email. Please try again later.";
        }

        return null;
    }

    private String getRegisterConfirmationEmailBody(String emailConfirmationToken, String username) {
        String confirmationLink = envConfiguration.getMailRegisterConfirmationLink() + emailConfirmationToken;

        return "<html>"
                + "<body>"
                + "<h2>Welcome " + username + "!</h2>"
                + "<p>Thank you for registering on our application.</p>"
                + "<p>To activate your account, please click on the following link:</p>"
                + "<p><a href=\"" + confirmationLink + "\">Confirm my email</a></p>"
                + "<p>If you did not create an account, please ignore this email.</p>"
                + "</body>"
                + "</html>";
    }

}
