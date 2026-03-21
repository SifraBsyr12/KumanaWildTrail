package com.wildtrails.backend.exception;

public class DuplicateSightingException extends RuntimeException {
    public DuplicateSightingException(String message) {
        super(message);
    }
}
