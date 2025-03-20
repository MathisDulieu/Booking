package com.microservices.authentication_service.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
@RequiredArgsConstructor
public class RabbitMQConfiguration {

    private final EnvConfiguration envConfiguration;
    private final ObjectMapper objectMapper;

//    @Bean
//    public ConnectionFactory connectionFactory() {
//        CachingConnectionFactory connectionFactory = new CachingConnectionFactory();
//        connectionFactory.setHost(envConfiguration.getSpringRabbitmqHost());
//        connectionFactory.setPort(Integer.parseInt(envConfiguration.getSpringRabbitmqPort()));
//        connectionFactory.setUsername(envConfiguration.getSpringRabbitmqUsername());
//        connectionFactory.setPassword(envConfiguration.getSpringRabbitmqPassword());
//        return connectionFactory;
//    }

    @Bean
    public ConnectionFactory connectionFactory() {
        CachingConnectionFactory connectionFactory = new CachingConnectionFactory();
        connectionFactory.setHost("rabbitmq");
        connectionFactory.setPort(Integer.parseInt("5672"));
        connectionFactory.setUsername("guest");
        connectionFactory.setPassword("guest");
        return connectionFactory;
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    @Bean
    public RabbitTemplate rabbitTemplate() {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory());
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }

    @Bean
    public AmqpAdmin amqpAdmin() {
        return new RabbitAdmin(connectionFactory());
    }

    @Bean
    public TopicExchange authExchange() {
        return new TopicExchange("auth-exchange");
    }

    @Bean
    public Queue authQueue() {
        return QueueBuilder.durable("auth.queue").build();
    }

    @Bean
    public Binding authBinding() {
        return BindingBuilder
                .bind(authQueue())
                .to(authExchange())
                .with("auth.*");
    }
}