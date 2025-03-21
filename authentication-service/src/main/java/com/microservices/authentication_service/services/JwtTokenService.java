package com.microservices.authentication_service.services;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtTokenService {

    public static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    private static final long TOKEN_EXPIRATION_TIME = 172_800_000;

    public String generateEmailConfirmationToken(String userId) {
        Instant now = Instant.now();
        Date expiryDate = Date.from(now.plusSeconds(TOKEN_EXPIRATION_TIME));

        return Jwts.builder()
                .setSubject(userId)
                .claim("type", "email_confirmation")
                .setIssuedAt(Date.from(now))
                .setExpiration(expiryDate)
                .signWith(SECRET_KEY, SignatureAlgorithm.HS512)
                .compact();
    }

}
