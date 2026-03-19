// src/main/java/com/wildtrails/backend/controller/BookingController.java
package com.wildtrails.backend.controller;

import com.wildtrails.backend.dto.BookingRequestDTO;
import com.wildtrails.backend.dto.BookingResponseDTO;
import com.wildtrails.backend.entity.Booking;
import com.wildtrails.backend.service.BookingService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(
            @RequestBody BookingRequestDTO request,
            @RequestAttribute(required = false) String authenticatedEmail) {
        try {
            Booking saved = bookingService.createBooking(request, authenticatedEmail);
            if (saved != null) {
                // Optional: send email here
                return ResponseEntity.ok(Map.of(
                        "message", "Booking completed successfully!",
                        "bookingId", saved.getId()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Booking could not be saved"));
            }
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Unexpected error: " + e.getMessage()));
        }
    }

    @GetMapping("/decrypt/{encryptedId}")
    public ResponseEntity<?> getBookingByEncryptedId(@PathVariable String encryptedId) {
        try {
            BookingResponseDTO dto = bookingService.getBookingByEncryptedId(encryptedId);
            return ResponseEntity.ok(dto);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid request: " + e.getMessage()));
        }
    }

}