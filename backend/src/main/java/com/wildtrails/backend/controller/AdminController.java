package com.wildtrails.backend.controller;

import com.wildtrails.backend.dto.BookingResponseDTO;
import com.wildtrails.backend.dto.DriverDTO;
import com.wildtrails.backend.dto.RegisterRequest;
import com.wildtrails.backend.dto.UpcomingBookingDTO;
import com.wildtrails.backend.entity.Booking;
import com.wildtrails.backend.entity.Driver;
import com.wildtrails.backend.repository.BookingRepository;
import com.wildtrails.backend.repository.DriverRepository;
import com.wildtrails.backend.service.AuthService;
import com.wildtrails.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AuthService authService;
    private final DriverRepository driverRepository;
    private final BookingRepository bookingRepository;
    private final EmailService emailService;
    // Only users with role ADMIN can access this
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register-driver")
    public ResponseEntity<?> registerDriver(@RequestBody RegisterRequest request) {

        try {
            authService.registerDriver(request);
            return ResponseEntity.ok("Driver registered successfully.");
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Something went wrong: " );
        }
    }

    @PostMapping("/getAvailableDrivers")
    public ResponseEntity<List<DriverDTO>> getAvailableDrivers(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime bookingDate) {

        List<Driver> drivers = driverRepository.findAvailableDriversByBookingDate(bookingDate);

        List<DriverDTO> driverDTOs = drivers.stream().map(driver -> {
            DriverDTO dto = new DriverDTO();
            dto.setId(driver.getId());
            dto.setName(driver.getUser().getName());
            dto.setIsAvailable(driver.is_available());
            dto.setVehicle_type(driver.getVehicle_type());
            dto.setPhoto_url(driver.getPhoto_url());
            return dto;
        }).toList();
        return ResponseEntity.ok(driverDTOs);
    }

    @PostMapping("/getAllUpcomingBooking")
    public ResponseEntity<List<UpcomingBookingDTO>> getAllUpcomingBookings(@RequestBody Map<String, String> request) {
        String todayStr = request.get("today");
        OffsetDateTime offsetDateTime = OffsetDateTime.parse(todayStr);
        LocalDateTime today = offsetDateTime.toLocalDateTime();

        List<Booking> bookings = bookingRepository.findBySafariDateAfter(today);

        List<UpcomingBookingDTO> upcomingBookings = bookings.stream().map(booking -> {
            UpcomingBookingDTO dto = new UpcomingBookingDTO();

            dto.setId(booking.getId());
            dto.setBookingDate(booking.getBookingDate() != null ? booking.getBookingDate().toLocalDate().toString() : null);
            dto.setBookingTime(booking.getBookingDate() != null ? booking.getBookingDate().toLocalTime().toString() : null);
            dto.setStatus(booking.getStatus());

            dto.setCustomerName(
                    booking.getCustomer() != null && booking.getCustomer().getUser() != null
                            ? booking.getCustomer().getUser().getName()
                            : ""
            );

            dto.setDriverName(
                    booking.getDriver() != null && booking.getDriver().getUser() != null
                            ? booking.getDriver().getUser().getName()
                            : ""
            );
            dto.setGuestUserName(booking.getGuestUserName());
            dto.setGuestUserEmail(booking.getGuestUserEmail());
            dto.setGuestUserPhone(booking.getGuestUserPhone());
            dto.setNumAdults(booking.getNumAdults());
            dto.setSafariDate(booking.getSafariDate());
            dto.setPickupLocation(booking.getPickupLocation());
            dto.setTotalAmount(booking.getTotalAmount());
            dto.setPaymentStatus(booking.getPaymentStatus());
            dto.setUpdatedAt(booking.getUpdatedAt());
            dto.setDriverStatus(booking.getDriverStatus());
            dto.setPackageName(booking.getPackage() != null ? booking.getPackage().getPackageName() : null);
            return dto;
        }).toList();
        return ResponseEntity.ok(upcomingBookings);
    }

    @PutMapping("bookings/{id}/assign-driver")
    public ResponseEntity<String> assignDriver(@PathVariable Long id) {
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Booking not found with ID: " + id);
        }

        Booking booking = optionalBooking.get();

        // Update status
        booking.setDriverStatus("assigned");
        booking.setStatus("confirmed");
        bookingRepository.save(booking);

        // Determine recipient email
        String recipientEmail = determineRecipientEmail(booking);
        if (recipientEmail == null || recipientEmail.isBlank()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Driver assigned, but no valid email found to send confirmation");
        }

        // Send appropriate confirmation email (after driver assignment → payment due)
        try {
            emailService.sendBookingConfirmationEmail(recipientEmail, booking.getId());
        } catch (Exception e) {
            // In production, use Logger instead of e.getMessage()
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Driver assigned successfully, but failed to send confirmation email: " + e.getMessage());
        }
        return ResponseEntity.ok("Driver assigned and confirmation email sent ");
    }
    private String determineRecipientEmail(Booking booking) {
        if (booking.getGuestUserEmail() != null && !booking.getGuestUserEmail().isBlank()) {
            return booking.getGuestUserEmail().trim();
        }

        if (booking.getCustomer() != null &&
                booking.getCustomer().getUser().getEmail() != null &&
                !booking.getCustomer().getUser().getEmail().isBlank()) {
            return booking.getCustomer().getUser().getEmail().trim();
        }
        return null;
    }

    @GetMapping("/getAllBooking")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();

        List<BookingResponseDTO> BookingResponse = bookings.stream().map(booking -> {
            BookingResponseDTO dto = new BookingResponseDTO();

            dto.setId(booking.getId());
            dto.setBookingDate(booking.getBookingDate() != null ? booking.getBookingDate().toLocalDate().toString() : null);
            dto.setBookingTime(booking.getBookingDate() != null ? booking.getBookingDate().toLocalTime().toString() : null);
            dto.setStatus(booking.getStatus());

            dto.setCustomerName(
                    booking.getCustomer() != null && booking.getCustomer().getUser() != null
                            ? booking.getCustomer().getUser().getName()
                            : ""
            );
            dto.setDriverName(
                    booking.getDriver() != null && booking.getDriver().getUser() != null
                            ? booking.getDriver().getUser().getName()
                            : ""
            );
            dto.setGuestUserName(booking.getGuestUserName());
            dto.setGuestUserEmail(booking.getGuestUserEmail());
            dto.setGuestUserPhone(booking.getGuestUserPhone());
            dto.setTotalAmount(booking.getTotalAmount());
            dto.setPaymentStatus(booking.getPaymentStatus());;
            dto.setDriverStatus(booking.getDriverStatus());
            dto.setPackageName(booking.getPackage() != null ? booking.getPackage().getPackageName() : null);
            return dto;
        }).toList();
        return ResponseEntity.ok(BookingResponse);
    }

    @PutMapping("/{bookingId}/cancel-booking")
    public ResponseEntity<String> cancelBooking(@PathVariable Long bookingId) {
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);
        if (bookingOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found");
        }
        Booking booking = bookingOptional.get();
        booking.setStatus("cancelled");
        bookingRepository.save(booking);
        return ResponseEntity.ok("Booking cancelled successfully");
    }

}
