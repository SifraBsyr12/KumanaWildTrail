package com.wildtrails.backend.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.wildtrails.backend.service.FirebaseUserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class FirebaseAuthenticationFilter extends OncePerRequestFilter {

    private final FirebaseAuth firebaseAuth;
    private final FirebaseUserService firebaseUserService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String requestUri = request.getRequestURI();
        log.info("FirebaseAuthenticationFilter processing URI: {}", requestUri);

        // Skip non-Firebase endpoints (e.g., /api/admin/** or /api/driver/**)
        if (!requestUri.startsWith("/api/customer/") &&
                !requestUri.equals("/api/auth/firebase") &&
                !requestUri.startsWith("/api/auth/firebase/")) {
            log.debug("Skipping FirebaseAuthenticationFilter for non-customer endpoint: {}", requestUri);
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String idToken = header.replace("Bearer ", "");
            try {
                FirebaseToken decodedToken = firebaseAuth.verifyIdToken(idToken);
                String email = decodedToken.getEmail();

                // Save or update user and customer, and get the User entity
                com.wildtrails.backend.entity.User user = firebaseUserService.saveOrUpdateUserAndCustomer(decodedToken);

                // Assign role as authority (e.g., "ROLE_CUSTOMER")
                List<GrantedAuthority> authorities = Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                );

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(email, null, authorities);

                SecurityContextHolder.getContext().setAuthentication(authentication);

                log.info("Firebase authentication successful for email: {} with authorities: {}", email, authorities);

            } catch (Exception e) {
                log.error("Firebase token verification failed", e);
            }
        } else {
            log.debug("No Firebase Bearer token found");
        }

        filterChain.doFilter(request, response);
    }
}