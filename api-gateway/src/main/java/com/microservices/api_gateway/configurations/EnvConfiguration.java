package com.microservices.api_gateway.configurations;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "booking.properties")
public class EnvConfiguration {
    private String allowedOrigins;
    private String springRabbitmqHost;
    private String springRabbitmqPort;
    private String springRabbitmqUsername;
    private String springRabbitmqPassword;
    private String eventServiceUrl;
    private String userServiceUrl;
    private String ticketServiceUrl;
    private String paymentServiceUrl;
    private String notificationServiceUrl;
    private String mongoUri;
    private String databaseName;
}

