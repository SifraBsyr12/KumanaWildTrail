package com.wildtrails.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDTO {
    private Long id;
    private String packageName;
    private String safariDate;
    private String status;//    private String status; //pending, confirmed, cancelled, completed
    private Double totalAmount;
    private String customerEmail;
    private String guestUserName;
    private String guestUserEmail;
    private String guestUserPhone;
    private String paymentStatus;
    private String driverStatus;
    private String BookingDate;
    private String BookingTime;
    private String CustomerName;
    private String DriverName;
}