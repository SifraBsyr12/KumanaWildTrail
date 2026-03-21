package com.wildtrails.backend.exception;

import com.wildtrails.backend.payload.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateSightingException.class)
    public ResponseEntity<ApiErrorResponse> handleDuplicateSightingException(DuplicateSightingException ex,
            HttpServletRequest request) {
        return buildResponse(ex, HttpStatus.CONFLICT, request);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiErrorResponse> handleRuntimeException(RuntimeException ex, HttpServletRequest request) {
        return buildResponse(ex, HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponse> handleBadRequest(Exception ex, HttpServletRequest request) {
        return buildResponse(ex, HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {
        return buildResponse(ex, HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleUsernameNotFound(UsernameNotFoundException ex,
            HttpServletRequest request) {
        return buildResponse(ex, HttpStatus.NOT_FOUND, request);
    }

    private ResponseEntity<ApiErrorResponse> buildResponse(Exception ex, HttpStatus status,
            HttpServletRequest request) {
        ApiErrorResponse response = new ApiErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                ex.getMessage(),
                request.getRequestURI());
        return new ResponseEntity<>(response, status);
    }
}
