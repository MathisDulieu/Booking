package com.microservices.payment_service.services;

import com.microservices.payment_service.UuidProvider;
import com.microservices.payment_service.dao.EventDao;
import com.microservices.payment_service.dao.PaymentDao;
import com.microservices.payment_service.dao.TicketDao;
import com.microservices.payment_service.dao.UserDao;
import com.microservices.payment_service.models.Payment;
import com.microservices.payment_service.models.enums.PaymentMethod;
import com.microservices.payment_service.models.request.PayWithCardRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Random;

import static java.util.Collections.singletonMap;
import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
public class CardService {

    private final PaymentDao paymentDao;
    private final UuidProvider uuidProvider;
    private final UserDao userDao;
    private final TicketDao ticketDao;
    private final EventDao eventDao;
    private final Random random = new Random();

    public Map<String, String> payWithCard(PayWithCardRequest request) {
        String validationError = validateIds(request);
        if (!isNull(validationError)) {
            return singletonMap("BAD_REQUEST", validationError);
        }

        if (request.getAmount() <= 0) {
            return singletonMap("BAD_REQUEST", "Amount must be greater than 0");
        }

        int randomValue = random.nextInt(5);

        if (randomValue == 0) {
            return singletonMap("INTERNAL_SERVER_ERROR", "Payment processing failed. Please try again later.");
        }

        Payment payment = buildPayment(request);

        paymentDao.save(payment);

        return singletonMap("message", "Payment processed successfully");
    }

    private Payment buildPayment(PayWithCardRequest request) {
        return Payment.builder()
                .id(uuidProvider.generateUuid())
                .paymentMethod(PaymentMethod.CARD)
                .userId(request.getUserId())
                .amount(request.getAmount())
                .eventId(request.getEventId())
                .ticketsIds(request.getTicketsIds())
                .build();
    }

    private String validateIds(PayWithCardRequest request) {
        if (userDao.doesNotExists(request.getUserId())) {
            return "User with ID " + request.getUserId() + " does not exist";
        }

        if (eventDao.doesNotExistsById(request.getEventId())) {
            return "Event with ID " + request.getEventId() + " does not exist";
        }

        List<String> ticketsIds = request.getTicketsIds();
        if (ticketsIds != null && !ticketsIds.isEmpty()) {
            for (String ticketId : ticketsIds) {
                if (ticketDao.doesNotExistsById(ticketId)) {
                    return "Ticket with ID " + ticketId + " does not exist";
                }
            }
        } else {
            return "No tickets provided for payment";
        }

        return null;
    }
}
