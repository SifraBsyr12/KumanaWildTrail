package com.wildtrails.backend.dto;

import lombok.Data;

@Data
public class AnimalSightingDTO {
    private String animalName;
    private String dateTime;  
    private String notes;     
    private Double lat;       
    private Double lng;       
}