package com.wildtrails.backend.dto;

import lombok.Data;

@Data
public class DriverDTO {
    private int id;
    private String Name;
    private Boolean isAvailable;
    private String photo_url;
    private String vehicle_type;
    private int seating_capacity;

}
