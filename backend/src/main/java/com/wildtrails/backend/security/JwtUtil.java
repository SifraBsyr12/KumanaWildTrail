package com.wildtrails.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.wildtrails.backend.entity.User;

import java.util.Date;
import javax.crypto.SecretKey;

@Component
public class JwtUtil {

    private final SecretKey secretKey = Keys.hmacShaKeyFor("ZmFrZXNlY3JldGtleWZvcndpbGR0cmFpbG1hdGU=".getBytes());
    private final long expirationMillis = 24 * 60 * 60 * 1000; // 1 day
    
    public String generateToken(Authentication authentication) {
        Object principal = authentication.getPrincipal();
    
        if (!(principal instanceof CustomUserDetails)) {
            throw new IllegalStateException("Unexpected principal type: " + principal.getClass());
        }
    
        CustomUserDetails customUserDetails = (CustomUserDetails) principal;
        User user = customUserDetails.getUserEntity();
    
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("id", user.getId())
                .claim("email", user.getEmail())
                .claim("name", user.getName())
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(secretKey)
                .compact();
    }
    
    

    public String extractUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(secretKey).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}