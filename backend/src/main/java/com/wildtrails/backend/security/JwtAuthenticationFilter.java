package com.wildtrails.backend.security;

import com.wildtrails.backend.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Base64;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String requestUri = request.getRequestURI();
        logger.info("JwtAuthenticationFilter processing URI: {}", requestUri);

        // Skip WebSocket endpoints
        if (requestUri.startsWith("/ws-sightings") || requestUri.startsWith("/ws")) {
            logger.debug("Skipping JwtAuthenticationFilter for WebSocket endpoint: {}", requestUri);
            filterChain.doFilter(request, response);
            return;
        }

        // Skip Firebase endpoints
        if (requestUri.startsWith("/api/auth/firebase/") || requestUri.equals("/api/auth/firebase")) {
            logger.info("Skipping JwtAuthenticationFilter for Firebase endpoint: {}", requestUri);
            filterChain.doFilter(request, response);
            return;
        }
        if (requestUri.startsWith("/api/auth/customer/") || requestUri.equals("/api/auth/customer")) {
            logger.info("Skipping JwtAuthenticationFilter for Firebase endpoint: {}", requestUri);
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        logger.info("Received Authorization Header: {}", authHeader);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.debug("No valid Bearer token found for URI: {}", requestUri);
            filterChain.doFilter(request, response);
            return;
        }

        String jwtToken = authHeader.substring(7);

        // Check for Firebase token before attempting to parse with JwtService
        if (isFirebaseToken(jwtToken)) {
            logger.debug("Firebase token detected for URI: {}, skipping JWT processing", requestUri);
            filterChain.doFilter(request, response);
            return;
        }

        String email = null;
        try {
            email = jwtService.extractUsername(jwtToken);
            logger.info("Extracted email: {}", email);
        } catch (Exception e) {
            logger.error("Error extracting email from token: {}", e.getMessage(), e);
            filterChain.doFilter(request, response);
            return;
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            if (jwtService.isTokenValid(jwtToken, email)) {
                String role = jwtService.extractClaim(jwtToken, claims -> claims.get("role", String.class));
                logger.info("Extracted role from JWT: {}", role);
                logger.info("UserDetails authorities: {}", userDetails.getAuthorities());
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.info("JWT authentication successful for email: {} with authorities: {}", email,
                        authentication.getAuthorities());
            } else {
                logger.warn("Invalid JWT token for URI: {}", requestUri);
            }
        } else {
            logger.debug("No email extracted or authentication already set for URI: {}", requestUri);
        }

        filterChain.doFilter(request, response);
    }

    private boolean isFirebaseToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return false;
            }
            String payload = new String(Base64.getDecoder().decode(parts[1]));
            return payload.contains("https://securetoken.google.com");
        } catch (Exception e) {
            logger.debug("Error checking if token is Firebase: {}", e.getMessage());
            return false;
        }
    }
}