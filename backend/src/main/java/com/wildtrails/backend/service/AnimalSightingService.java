package com.wildtrails.backend.service;

import com.wildtrails.backend.dto.AnimalHotspotDTO;
import com.wildtrails.backend.dto.AnimalSightingDTO;
import com.wildtrails.backend.dto.SightingTimeDTO;
import com.wildtrails.backend.entity.AnimalSighting;
import com.wildtrails.backend.entity.Driver;
import com.wildtrails.backend.entity.Location;
import com.wildtrails.backend.exception.DuplicateSightingException;
import com.wildtrails.backend.repository.AnimalSightingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.time.ZoneId;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnimalSightingService {

    private static final Logger logger = LoggerFactory.getLogger(AnimalSightingService.class);
    private final AnimalSightingRepository repository;

    public AnimalSightingService(AnimalSightingRepository repository) {
        this.repository = repository;
    }
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; 
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    

    public AnimalSighting saveAnimalSighting(AnimalSightingDTO dto, Driver driver) {
        logger.info("Saving sighting for driver: {}", driver.getId());
    
        double radiusMeters = 500;
        int minutesWindow = 15;
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(minutesWindow);
        List<AnimalSighting> recentSightings = repository.findByAnimalNameAndDateTimeAfter(dto.getAnimalName(), cutoffTime);
    
        for (AnimalSighting sighting : recentSightings) {
            Location existingLocation = sighting.getLocation();
            if (existingLocation != null && dto.getLat() != null && dto.getLng() != null) {
                double distance = calculateDistance(dto.getLat(), dto.getLng(),
                        existingLocation.getLat(), existingLocation.getLng());
                if (distance < radiusMeters) {
                    logger.warn("Duplicate sighting detected within {} meters", radiusMeters);
                     throw new DuplicateSightingException("Duplicate sighting detected within " + radiusMeters + " meters and " + minutesWindow + " minutes");
                }
            }
        }
    
        try {
            AnimalSighting sighting = new AnimalSighting();
            sighting.setAnimalName(dto.getAnimalName());
            sighting.setNotes(dto.getNotes());
    
            // Convert ISO time to IST
            if (dto.getDateTime() != null) {
                ZonedDateTime utcDateTime = ZonedDateTime.parse(dto.getDateTime(), DateTimeFormatter.ISO_DATE_TIME);
                ZonedDateTime istDateTime = utcDateTime.withZoneSameInstant(ZoneId.of("Asia/Kolkata"));
                sighting.setDateTime(istDateTime.toLocalDateTime());
            }
    
            // Set Location
            if (dto.getLat() != null && dto.getLng() != null) {
                Location location = new Location();
                location.setLat(dto.getLat());
                location.setLng(dto.getLng());
                sighting.setLocation(location);
            }
    
            sighting.setSubmittedBy(driver);
            return repository.save(sighting);
        } catch (Exception e) {
            logger.error("Error saving sighting: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save sighting: " + e.getMessage(), e);
        }
    }

    public List<AnimalSighting> getSightingsAfter(LocalDateTime time) {
        return repository.findByDateTimeAfter(time);
    }

    public void deleteASighting(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            throw new RuntimeException("Animal sighting not found with ID: " + id);
        }
    }
    public List<AnimalHotspotDTO> getAnimalHotspots() {
        List<Object[]> results = repository.findCurrentHotspots();
        return results.stream()
                .map(result -> new AnimalHotspotDTO(
                        (String) result[0],  // animal_name
                        ((Number) result[1]).doubleValue(),  // lat (BigDecimal to Double)
                        ((Number) result[2]).doubleValue(),  // lng (BigDecimal to Double)
                        ((Number) result[3]).longValue()    // sightings_count
                ))
                .toList();
    }

    public List<SightingTimeDTO> getSightingsByTimeDistribution(String animalName) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<AnimalSighting> sightings = repository.findSightingsByAnimalAndHourRange(animalName, thirtyDaysAgo);

        return sightings.stream()
                .map(s -> new SightingTimeDTO(s.getAnimalName(), s.getDateTime()))
                .collect(Collectors.toList());
    }
}