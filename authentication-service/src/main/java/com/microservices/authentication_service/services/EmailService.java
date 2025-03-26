package com.microservices.authentication_service.services;

import com.microservices.authentication_service.configuration.EnvConfiguration;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final EnvConfiguration envConfiguration;

    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "utf-8");

            helper.setFrom(envConfiguration.getAppEmail(), envConfiguration.getMailModifiedUsername());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body + getEmailSignature(), true);

            javaMailSender.send(mimeMessage);
        } catch (MailException | MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Error sending email: " + e.getMessage(), e);
        }
    }

    private static String getEmailSignature() {
        return "<br>"
                + "<p>Best regards,<br>"
                + "The EventHub Team.</p>"
                + "<p>EventHub - Your ticketing platform for all your events.</p>"
                + "<p>📞 Support: <a href=\"tel:+33123456789\">+33 1 23 45 67 89</a><br>"
                + "📩 Email: <a href=\"mailto:support@eventhub.com\">support@eventhub.com</a><br>"
                + "🌐 Website: <a href=\"http://localhost\">http://localhost</a><br>"
                + "📱 Available on iOS and Android!</p>";
    }

}
