package com.wildtrails.backend.service;
import com.wildtrails.backend.dto.SightingSummeryResponseDTO;
import com.wildtrails.backend.entity.AnimalSighting;
import com.wildtrails.backend.repository.AnimalSightingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SightingSummeryService {

    @Autowired
    private AnimalSightingRepository sightingRepository;
//    @Autowired
//    private SightingSummeryResponseDTO SightingResponse;

    public List<SightingSummeryResponseDTO> getSightingsForLast30Days() {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(30);
        List<AnimalSighting> sightings = sightingRepository.findByDateTimeBetween(startDate, endDate);
        return aggregateSightingsByDate(sightings);
    }

    public List<SightingSummeryResponseDTO> getSightingsForMonth(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        List<AnimalSighting> sightings = sightingRepository.findByDateTimeBetween(startDate, endDate);
        return aggregateSightingsByDate(sightings);
    }

    public SightingSummeryResponseDTO getSightingsForDate(LocalDate date) {
        LocalDateTime startDate = date.atStartOfDay();
        LocalDateTime endDate = date.atTime(23, 59, 59);
        List<AnimalSighting> sightings = sightingRepository.findByDateTimeBetween(startDate, endDate);
        return aggregateSightingsByDate(sightings).stream().findFirst().orElse(new SightingSummeryResponseDTO());
    }

    private List<SightingSummeryResponseDTO> aggregateSightingsByDate(List<AnimalSighting> sightings) {
        // Group sightings by date
        Map<LocalDate, List<AnimalSighting>> sightingsByDate = sightings.stream()
                .collect(Collectors.groupingBy(
                        sighting -> sighting.getDateTime().toLocalDate(),
                        TreeMap::new, // Sort by date
                        Collectors.toList()
                ));

        // Convert to SightingResponse list
        List<SightingSummeryResponseDTO> responses = new ArrayList<>();
        for (Map.Entry<LocalDate, List<AnimalSighting>> entry : sightingsByDate.entrySet()) {
            LocalDate date = entry.getKey();
            List<AnimalSighting> dailySightings = entry.getValue();

            // Aggregate animal counts
            Map<String, Integer> animalCounts = new HashMap<>();
            Map<String, SightingSummeryResponseDTO.LocationDTO> locationMap = new HashMap<>();

            for (AnimalSighting sighting : dailySightings) {
                String animalName = sighting.getAnimalName().toLowerCase();
                // Update animal counts
                animalCounts.merge(animalName, 1, Integer::sum);

                // Update location (use the first sighting's location for simplicity)
                if (!locationMap.containsKey(animalName) && sighting.getLocation() != null) {
                    locationMap.put(animalName, new SightingSummeryResponseDTO.LocationDTO(
                            sighting.getLocation().getLat(),
                            sighting.getLocation().getLng(),
                            sighting.getNotes() != null ? sighting.getNotes() : animalName + " sighting"
                    ));
                }
            }

            SightingSummeryResponseDTO response = new SightingSummeryResponseDTO();
            response.setDate(date.toString());
            response.setAnimals(animalCounts);
            response.setLocations(locationMap);
            responses.add(response);
        }

        return responses;
    }
}