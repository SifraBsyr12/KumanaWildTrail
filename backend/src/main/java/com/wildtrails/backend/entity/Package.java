package com.wildtrails.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "packages")
public class Package {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long packageID;

    // Common fields
    @Column(nullable = false)
    private String packageName;

    @Column(nullable = false)
    private Double packagePrice;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PackageType packageType;

    @Column(length = 500)
    private String imageUrl;

    // --- Safari-specific fields ---
    private Integer maxPeople;
    private String time;

    // --- Activity-specific fields ---
    @Column(length = 2000)
    private String details;
    private String location;
    private String timeSlots;

    // --- Hire-specific fields ---
    private String vehicleType;
    private String tourName;
    private Integer capacity;
    private Integer noOfDays;

    public enum PackageType {
        SAFARI,
        HIRE,
        ACTIVITY
    }
}
