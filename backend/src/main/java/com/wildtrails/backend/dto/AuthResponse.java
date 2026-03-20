package com.wildtrails.backend.dto;

import lombok.Builder;

@Builder
public class AuthResponse {
    private String token;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String token) {
        this.token = token;
    }

    public AuthResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }

    public AuthResponse(String messageOnly, boolean isMessageOnly) {
        this.message = messageOnly;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
