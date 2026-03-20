package com.wildtrails.backend.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class PackageRequestDTO {
    private String packageName;
    private Double packagePrice;
    private String packageType;
    private MultipartFile imageFile;
    private String details;
    private Integer maxPeople;
    private String vehicleType;
    private String tourName;
    private Integer capacity;
    private String time;
    private String timeSlots;
    private String location;
}
