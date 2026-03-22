package com.wildtrails.backend.dto;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class UpcomingBookingDTO {
    private Long id;
    private String bookingDate;
    private String bookingTime;
    private String status; //pending, confirmed, cancelled, completed
    private String customerName;
    private String driverName;
    private String guestUserName;
    private String guestUserEmail;
    private String guestUserPhone;
    private Integer numAdults;
    private Date safariDate;
    private String pickupLocation;
    private Double totalAmount;
    private String paymentStatus;
    private LocalDateTime updatedAt;
    private String driverStatus;
    private String PackageName;
}
