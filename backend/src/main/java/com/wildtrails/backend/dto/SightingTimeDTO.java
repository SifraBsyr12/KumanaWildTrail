package com.wildtrails.backend.dto;

import java.time.LocalDateTime;

public class SightingTimeDTO {
    private String animalName;
    private LocalDateTime dateTime;

    public SightingTimeDTO(String animalName, LocalDateTime dateTime) {
        this.animalName = animalName;
        this.dateTime = dateTime;
    }

    public String getAnimalName() {
        return animalName;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }
}
