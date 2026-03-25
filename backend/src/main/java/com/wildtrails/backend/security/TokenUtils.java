package com.wildtrails.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Base64;
import java.util.Map;

public class TokenUtils {

    public static boolean isFirebaseToken(String token) {
        try {
            // JWT format: header.payload.signature
            String[] parts = token.split("\\.");
            if (parts.length != 3) return false;

            // Decode payload (Base64URL)
            byte[] decodedBytes = Base64.getUrlDecoder().decode(parts[1]);
            String payloadJson = new String(decodedBytes);

            // Parse JSON payload
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> claims = mapper.readValue(payloadJson, new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {});

            String iss = (String) claims.get("iss");
            String aud = (String) claims.get("aud");

            // Check Firebase-specific issuer
            return iss != null && iss.startsWith("https://securetoken.google.com/")
                   // Optional: check project ID
                   && "wildtrails-60d05".equals(aud);
        } catch (Exception e) {
            return false; // Token is not a valid JWT or not Firebase
        }
    }
}
