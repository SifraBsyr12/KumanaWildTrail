package com.wildtrails.backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
@AllArgsConstructor
@Data
public class AnimalHotspotDTO {
    private String animalName;
    private double lat;
    private double lng;
    private long sightingsCount;
}
