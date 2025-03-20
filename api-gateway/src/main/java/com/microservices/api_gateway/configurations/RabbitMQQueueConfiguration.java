package com.microservices.api_gateway.configurations;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitMQQueueConfiguration {

    public static final String USER_EXCHANGE = "user.exchange";
    public static final String USER_QUEUE = "user.queue";
    public static final String USER_ROUTING_KEY = "user.routing.key";

    public static final String EVENT_EXCHANGE = "event.exchange";
    public static final String EVENT_QUEUE = "event.queue";
    public static final String EVENT_ROUTING_KEY = "event.routing.key";

    @Bean
    public DirectExchange userExchange() {
        return new DirectExchange(USER_EXCHANGE);
    }

    @Bean
    public Queue userQueue() {
        return QueueBuilder.durable(USER_QUEUE).build();
    }

    @Bean
    public Binding userBinding() {
        return BindingBuilder.bind(userQueue()).to(userExchange()).with(USER_ROUTING_KEY);
    }

    @Bean
    public DirectExchange eventExchange() {
        return new DirectExchange(EVENT_EXCHANGE);
    }

    @Bean
    public Queue eventQueue() {
        return QueueBuilder.durable(EVENT_QUEUE).build();
    }

    @Bean
    public Binding eventBinding() {
        return BindingBuilder.bind(eventQueue()).to(eventExchange()).with(EVENT_ROUTING_KEY);
    }

}
