package com.wildtrails.backend.dto;

import com.google.firebase.database.annotations.NotNull;
import lombok.Data;
import org.checkerframework.checker.index.qual.Positive;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class BookingRequestDTO {

    private String customerEmail;

    // ---------- Guest user ----------
    private String guestUserName;
    private String guestUserEmail;
    private String guestUserPhone;
    @NotNull
    private Long packageId;
    private Integer numAdults;

    @NotNull
    private Date safariDate;
    private String pickupLocation;
    @NotNull @Positive
    private Double totalAmount;
    private LocalDateTime bookingDate;
    private String driverStatus;
    private String timeSlot ;
    private Integer hiredDays;
}