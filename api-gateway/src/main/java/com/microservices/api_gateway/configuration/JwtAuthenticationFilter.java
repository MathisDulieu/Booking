package com.microservices.api_gateway.configuration;

import com.microservices.api_gateway.services.JwtTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Objects;

@Component
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenService jwtTokenService;

    @Override
    protected void doFilterInternal(@NotNull HttpServletRequest request,
                                    @NotNull HttpServletResponse response,
                                    @NotNull FilterChain filterChain) throws ServletException, IOException {
        if (isNotPrivateRoute(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        Authentication userInformations = getUserInformations(request);
        if (Objects.isNull(userInformations)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "You must be authenticated to perform this action.");
            return;
        }

        SecurityContextHolder.getContext().setAuthentication(userInformations);
        filterChain.doFilter(request, response);
    }

    private Authentication getUserInformations(HttpServletRequest request) {
        String userId = jwtTokenService.resolveUserIdFromRequest(request);
        if (Objects.isNull(userId)) {
            return null;
        }

        return new UsernamePasswordAuthenticationToken(
                userId,
                null,
                Collections.singletonList(new SimpleGrantedAuthority("USER"))
        );
    }

    private boolean isNotPrivateRoute(String uri) {
        return !uri.startsWith("/api/private");
    }
}