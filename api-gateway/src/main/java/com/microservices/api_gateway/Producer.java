package com.microservices.api_gateway;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import static java.util.Objects.isNull;

@Component
@RequiredArgsConstructor
@Slf4j
public class Producer {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    public <T> void sendMessage(String topic, String key, T value) {
        try {
            log.info("Sending message to topic: {}, key: {}", topic, key);
            rabbitTemplate.convertAndSend(topic, key, value);
            log.info("Message sent successfully to topic: {}", topic);
        } catch (Exception e) {
            log.error("Error sending message to topic: {}, key: {}: {}",
                    topic, key, e.getMessage(), e);
            throw new RuntimeException("Failed to send message to RabbitMQ", e);
        }
    }

    public <T, R> R sendAndReceive(String topic, String key, T value, Class<R> responseType) {
        try {
            log.info("Sending request to topic: {}, key: {} and waiting for response", topic, key);
            Object response = rabbitTemplate.convertSendAndReceive(topic, key, value);

            if (isNull(response)) {
                log.warn("No response received from topic: {}, key: {}", topic, key);
                return null;
            }

            if (responseType.isInstance(response)) {
                return responseType.cast(response);
            }

            return objectMapper.convertValue(response, responseType);

        } catch (Exception e) {
            log.error("Error in request to topic: {}, key: {}: {}",
                    topic, key, e.getMessage(), e);
            throw new RuntimeException("Failed to process message with RabbitMQ", e);
        }
    }

}
