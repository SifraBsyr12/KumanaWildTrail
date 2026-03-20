package com.wildtrails.backend.dto;

import com.wildtrails.backend.entity.Package.PackageType;
import lombok.Data;

@Data
public class PackageResponseDTO {
    private Long packageID;
    private String packageName;
    private Double packagePrice;
    private PackageType packageType;
    private String imageUrl;
    private String details;
    private Integer maxPeople;
    private String time;
    private String vehicleType;
    private String tourName;
    private Integer capacity;
    private String location;
    private String timeSlots;
}
