package com.microservices.api_gateway.configurations;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.tags.Tag;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;

@Configuration
public class SwaggerConfiguration {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Ticket Booking System API")
                        .description("API for managing concert and event ticket bookings")
                        .license(new License().name("Apache License Version 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html"))
                        .version("1.0.0"))
                .addServersItem(new io.swagger.v3.oas.models.servers.Server()
                        .url("http://localhost")
                        .description("Local Server"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")))
                .addTagsItem(new Tag().name("Authentication").description("Endpoints for authentication, login and registration"))
                .addTagsItem(new Tag().name("User").description("Endpoints for user account management"))
                .addTagsItem(new Tag().name("Event").description("Endpoints for event management (creation, update, deletion, search)"))
                .addTagsItem(new Tag().name("Ticket").description("Endpoints for ticket booking management"))
                .addTagsItem(new Tag().name("Payment").description("Endpoints for payment processing operations"))
                .addTagsItem(new Tag().name("Notification").description("Endpoints for email and SMS notification services"));
    }

    @Bean
    public OperationCustomizer globalResponses() {
        return (operation, handlerMethod) -> {
            ApiResponses apiResponses = operation.getResponses() != null ? operation.getResponses() : new ApiResponses();
            apiResponses.addApiResponse("429", new ApiResponse()
                    .description("Too Many Requests")
                    .content(new Content()
                            .addMediaType("application/json", new MediaType().example(Collections.singletonMap("message", "Too many requests. Please try again later.")))));
            operation.setResponses(apiResponses);
            return operation;
        };
    }

}
