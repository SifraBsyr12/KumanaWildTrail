package com.wildtrails.backend.dto;

import java.time.Duration;
import java.time.LocalDateTime;
import com.wildtrails.backend.entity.AnimalSighting;
import lombok.Data;

@Data
public class AnimalSightingResponseDTO {
    private static final long EXPIRATION_SECONDS = 1800; // 30 minutes in seconds
    
    private Long sightingId;
    private String animalName;
    private LocalDateTime dateTime;
    private String notes;
    private double lat;
    private double lng;
    private String submittedBy;
    private long expiresInSeconds;

    // Single constructor
    public AnimalSightingResponseDTO(AnimalSighting sighting) {
        this.sightingId = sighting.getSightingId();
        this.animalName = sighting.getAnimalName();
        this.dateTime = sighting.getDateTime();
        this.notes = sighting.getNotes();
        this.lat = sighting.getLocation().getLat();
        this.lng = sighting.getLocation().getLng();
        this.submittedBy = sighting.getSubmittedBy().getUser().getName();
        
        // Correct expiration calculation
        LocalDateTime expirationTime = sighting.getDateTime().plusSeconds(EXPIRATION_SECONDS);
        long secondsRemaining = Duration.between(LocalDateTime.now(), expirationTime).getSeconds();
        this.expiresInSeconds = Math.max(secondsRemaining, 0);
    }
}