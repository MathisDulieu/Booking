package com.microservices.authentication_service.configuration;

import com.fasterxml.jackson.databind.DeserializationFeature;
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
import org.springframework.retry.backoff.ExponentialBackOffPolicy;
import org.springframework.retry.policy.SimpleRetryPolicy;
import org.springframework.retry.support.RetryTemplate;

@Configuration
@EnableRabbit
@RequiredArgsConstructor
public class RabbitMQConfiguration {

    private final EnvConfiguration envConfiguration;
    private final ObjectMapper objectMapper;

    @Bean
    public ConnectionFactory connectionFactory() {
        CachingConnectionFactory connectionFactory = new CachingConnectionFactory();
        connectionFactory.setHost(envConfiguration.getSpringRabbitmqHost());
        connectionFactory.setPort(Integer.parseInt(envConfiguration.getSpringRabbitmqPort()));
        connectionFactory.setUsername(envConfiguration.getSpringRabbitmqUsername());
        connectionFactory.setPassword(envConfiguration.getSpringRabbitmqPassword());

        connectionFactory.setRequestedHeartBeat(30);
        connectionFactory.setConnectionTimeout(5000);
        connectionFactory.setPublisherReturns(true);

        return connectionFactory;
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter messageConverter) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter);
        rabbitTemplate.setReplyTimeout(10000);
        return rabbitTemplate;
    }

    @Bean
    public TopicExchange authExchange() {
        return new TopicExchange("auth-exchange", true, false);
    }

    @Bean
    public Queue authQueue() {
        return QueueBuilder.durable("auth.queue").build();
    }

    @Bean
    public Binding authBinding(Queue authQueue, TopicExchange authExchange) {
        return BindingBuilder
                .bind(authQueue)
                .to(authExchange)
                .with("auth.*");
    }

    @Bean
    public AmqpAdmin amqpAdmin(ConnectionFactory connectionFactory) {
        return new RabbitAdmin(connectionFactory);
    }

    @Bean
    public SimpleRetryPolicy retryPolicy() {
        SimpleRetryPolicy policy = new SimpleRetryPolicy();
        policy.setMaxAttempts(5);
        return policy;
    }

    @Bean
    public RetryTemplate retryTemplate() {
        RetryTemplate template = new RetryTemplate();
        template.setRetryPolicy(retryPolicy());
        template.setBackOffPolicy(new ExponentialBackOffPolicy());
        return template;
    }
}