package com.microservices.api_gateway.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class Producer {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    public <T, R> R sendAndReceive(String exchange, String routingKey, T request, Class<R> responseType) {
        try {
            String requestJson = objectMapper.writeValueAsString(request);
            log.info("Sending message to {}.{}: {}", exchange, routingKey, requestJson);

            Object response = rabbitTemplate.convertSendAndReceive(exchange, routingKey, requestJson);

            if (response == null) {
                log.error("No response received from {}.{}", exchange, routingKey);
                return null;
            }

            log.info("Received response from {}.{}: {}", exchange, routingKey, response);

            if (response instanceof String) {
                return objectMapper.readValue((String) response, responseType);
            } else {
                return objectMapper.convertValue(response, responseType);
            }

        } catch (Exception e) {
            log.error("Error during sendAndReceive: ", e);
            throw new RuntimeException("Communication error: " + e.getMessage(), e);
        }
    }
}