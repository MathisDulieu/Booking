package com.microservices.authentication_service.services;

import com.microservices.authentication_service.configuration.EnvConfiguration;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;

import static java.util.Objects.isNull;

@Component
@RequiredArgsConstructor
public class JwtTokenService {

    private final EnvConfiguration envConfiguration;
    private static final long TOKEN_EXPIRATION_TIME = 172_800_000;

    public String generateEmailConfirmationToken(String userId) {
        Instant now = Instant.now();
        Date expiryDate = Date.from(now.plusMillis(TOKEN_EXPIRATION_TIME));

        return Jwts.builder()
                .setSubject(userId)
                .claim("type", "email_confirmation")
                .setIssuedAt(Date.from(now))
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateToken(String userId) {
        Instant now = Instant.now();
        Date expiryDate = Date.from(now.plusMillis(TOKEN_EXPIRATION_TIME));

        return Jwts.builder()
                .setSubject(userId)
                .claim("type", "access")
                .setIssuedAt(Date.from(now))
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public boolean isEmailTokenValid(String token) {
        Claims claims = parseTokenClaims(token);
        if (isNull(claims)) {
            return false;
        }

        if (!isEmailConfirmationToken(claims)) {
            return false;
        }

        return isTokenNotExpired(claims);
    }

    public String resolveUserIdFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody().getSubject();
    }

    private Claims parseTokenClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            return null;
        }
    }

    private boolean isEmailConfirmationToken(Claims claims) {
        return "email_confirmation".equals(claims.get("type"));
    }

    private boolean isTokenNotExpired(Claims claims) {
        Date expirationDate = claims.getExpiration();
        return expirationDate != null && expirationDate.after(new Date());
    }

    private Key getSigningKey() {
        String secretString = envConfiguration.getJwtSecretKey();
        byte[] keyBytes = secretString.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
