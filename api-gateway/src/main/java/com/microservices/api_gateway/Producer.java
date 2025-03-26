package com.microservices.api_gateway;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class Producer {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    public <T, R> R sendAndReceive(String exchange, String routingKey, T request, Class<R> responseType) {
        try {
            String requestJson = objectMapper.writeValueAsString(request);

            Object response = rabbitTemplate.convertSendAndReceive(exchange, routingKey, requestJson);

            if (response instanceof String) {
                return objectMapper.readValue((String) response, responseType);
            } else {
                return objectMapper.convertValue(response, responseType);
            }

        } catch (Exception e) {
            throw new RuntimeException("Communication error: " + e.getMessage(), e);
        }
    }
}