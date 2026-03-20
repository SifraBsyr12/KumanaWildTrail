package com.wildtrails.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private String customerName;
    private int rating;
    private String date;        // booking date formatted as string
    private String comment;
    private String driverName;
}
