package com.microservices.payment_service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservices.payment_service.models.request.PayWithCardRequest;
import com.microservices.payment_service.models.request.PayWithPaypalRequest;
import com.microservices.payment_service.services.CardService;
import com.microservices.payment_service.services.PaypalService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.ExchangeTypes;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class Consumer {

    private final CardService cardService;
    private final PaypalService paypalService;
    private final ObjectMapper objectMapper;

    @RabbitListener(
            bindings = @QueueBinding(
                    value = @Queue(value = "payment.queue", durable = "true"),
                    exchange = @Exchange(value = "payment-exchange", type = ExchangeTypes.TOPIC),
                    key = "payment.*"
            )
    )
    public String handleAuthRequest(String payload, Message message) {
        String routingKey = message.getMessageProperties().getReceivedRoutingKey();

        try {
            Map<String, String> result = switch (routingKey) {
                case "payment.payWithPaypal" -> {
                    PayWithPaypalRequest payWithPaypalRequest = objectMapper.readValue(payload, PayWithPaypalRequest.class);
                    yield paypalService.payWithPaypal(payWithPaypalRequest);
                }
                case "payment.payWithCard" -> {
                    PayWithCardRequest payWithCardRequest = objectMapper.readValue(payload, PayWithCardRequest.class);
                    yield cardService.payWithCard(payWithCardRequest);
                }
                default -> throw new IllegalStateException("Unexpected value: " + routingKey);
            };

            return objectMapper.writeValueAsString(result);
        } catch (Exception e) {
            try {
                return objectMapper.writeValueAsString(Map.of("error", e.getMessage()));
            } catch (JsonProcessingException ex) {
                return "{\"error\": \"Internal server error\"}";
            }
        }
    }
}
