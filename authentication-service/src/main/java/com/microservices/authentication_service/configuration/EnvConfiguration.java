package com.microservices.authentication_service.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "booking.properties")
public class EnvConfiguration {
    private String springRabbitmqHost;
    private String springRabbitmqPort;
    private String springRabbitmqUsername;
    private String springRabbitmqPassword;
    private String mongoUri;
    private String databaseName;
    private String mailRegisterConfirmationLink;
    private String appEmail;
    private String mailModifiedUsername;
    private String jwtSecretKey;
}
