// src/main/java/com/wildtrails/backend/service/BookingService.java
package com.wildtrails.backend.service;

import com.wildtrails.backend.dto.BookingRequestDTO;
import com.wildtrails.backend.dto.BookingResponseDTO;
import com.wildtrails.backend.entity.Booking;
import com.wildtrails.backend.entity.Customer;
import com.wildtrails.backend.entity.Package;
import com.wildtrails.backend.repository.BookingRepository;
import com.wildtrails.backend.repository.CustomerRepository;
import com.wildtrails.backend.repository.PackageRepository;
import com.wildtrails.backend.security.EncryptionUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final PackageRepository packageRepository;
    private final EmailService emailService;

    public Booking createBooking(BookingRequestDTO request, String authenticatedEmail) {
        Booking booking = new Booking();

        // === 1. Resolve Customer (registered) or Guest ===
        if (request.getCustomerEmail() != null && !request.getCustomerEmail().isBlank()) {
            Customer customer = customerRepository.findByUserEmail(request.getCustomerEmail())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Customer not found with email: " + request.getCustomerEmail()));

            if (authenticatedEmail != null && !authenticatedEmail.equals(request.getCustomerEmail())) {
                throw new SecurityException("You can only book using your own email");
            }
            booking.setCustomer(customer);
        } else {
            if (request.getGuestUserEmail() == null || request.getGuestUserEmail().isBlank()) {
                throw new IllegalArgumentException("Guest email is required for guest booking");
            }
            booking.setGuestUserName(request.getGuestUserName());
            booking.setGuestUserEmail(request.getGuestUserEmail());
            booking.setGuestUserPhone(request.getGuestUserPhone());
        }

        Package pkg = packageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new EntityNotFoundException("Package not found: " + request.getPackageId()));
        booking.setPackage(pkg);

        booking.setNumAdults(request.getNumAdults());
        booking.setSafariDate(request.getSafariDate());
        booking.setPickupLocation(request.getPickupLocation());
        booking.setTotalAmount(request.getTotalAmount());
        booking.setBookingDate(request.getBookingDate() != null ? request.getBookingDate() : LocalDateTime.now());
        booking.setStatus("pending");
        booking.setPaymentStatus("pending");
        booking.setUpdatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        String email = booking.getCustomer() != null
                ? booking.getCustomer().getUser().getEmail()
                : booking.getGuestUserEmail();

        try {
            emailService.sendBookingEmail(email, savedBooking.getId());
        } catch (Exception e) {
            throw new RuntimeException("Email sending failed, booking was not successful", e);
        }

        return savedBooking;
    }
    public BookingResponseDTO getBookingByEncryptedId(String encryptedId) {
        try {
            // Step 1: Decrypt ID
            String decrypted = EncryptionUtil.decrypt(encryptedId);
            Long bookingId = Long.parseLong(decrypted);

            // Step 2: Fetch Booking
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new EntityNotFoundException("Booking not found"));

            BookingResponseDTO dto = new BookingResponseDTO();
            dto.setId(booking.getId());
            dto.setPackageName(booking.getPackage() != null ? booking.getPackage().getPackageName() : "N/A");
            dto.setSafariDate(booking.getSafariDate() != null ? booking.getSafariDate().toString() : "N/A");
            dto.setStatus(booking.getStatus());
            dto.setTotalAmount(booking.getTotalAmount());
            dto.setPaymentStatus(booking.getPaymentStatus());
            dto.setDriverStatus(booking.getDriverStatus());

            if (booking.getCustomer() != null && booking.getCustomer().getUser() != null) {
                dto.setCustomerEmail(booking.getCustomer().getUser().getEmail());
            } else {
                dto.setGuestUserName(booking.getGuestUserName());
                dto.setGuestUserEmail(booking.getGuestUserEmail());
                dto.setGuestUserPhone(booking.getGuestUserPhone());
            }

            return dto;

        } catch (Exception e) {
            // Invalid or tampered encrypted ID
            throw new EntityNotFoundException("Invalid or expired booking link");
        }
    }

}
