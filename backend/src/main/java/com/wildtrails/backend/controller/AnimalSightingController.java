package com.wildtrails.backend.controller;

import com.wildtrails.backend.dto.*;
import com.wildtrails.backend.service.SightingSummeryService;
import com.wildtrails.backend.service.AnimalSightingService;
import com.wildtrails.backend.entity.AnimalSighting;
import com.wildtrails.backend.entity.Driver;
import com.wildtrails.backend.repository.DriverRepository;
import com.wildtrails.backend.service.WebSocketSightingNotifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@PreAuthorize("hasAnyRole('DRIVER','ADMIN')")
@RequestMapping("/api/sightings")
public class AnimalSightingController {

    private final AnimalSightingService service;
    private final DriverRepository driverRepository;
    private final WebSocketSightingNotifier sightingNotifier;
    private final SightingSummeryService summeryService;

    public AnimalSightingController(
            AnimalSightingService service,
            DriverRepository driverRepository,
            WebSocketSightingNotifier sightingNotifier,
            SightingSummeryService summeryService) {
        this.service = service;
        this.driverRepository = driverRepository;
        this.sightingNotifier = sightingNotifier;
        this.summeryService = summeryService;
    }

    @PostMapping("/createSighting")
    public ResponseEntity<AnimalSightingResponseDTO> createSighting(
            @RequestBody AnimalSightingDTO dto,
            Authentication authentication) {

        String email = authentication.getName();
        Driver driver = driverRepository.findByUser_Email(email)
                .orElseThrow(() -> new UsernameNotFoundException("Driver not found"));

        AnimalSighting saved = service.saveAnimalSighting(dto, driver);

        AnimalSightingResponseDTO response = new AnimalSightingResponseDTO(saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<AnimalSightingResponseDTO>> getRecentSightings() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(30);
        List<AnimalSighting> raw = service.getSightingsAfter(cutoff);
        List<AnimalSightingResponseDTO> response = raw.stream()
                .map(AnimalSightingResponseDTO::new)
                .toList();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{Id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteSighting(@PathVariable Long Id) {
        service.deleteASighting(Id);
        return ResponseEntity.ok("Animal sight deleted");
    }

    @GetMapping("/last-30-days")
    public ResponseEntity<List<SightingSummeryResponseDTO>> getLast30Days() {
        List<SightingSummeryResponseDTO> sightings = summeryService.getSightingsForLast30Days();
        return ResponseEntity.ok(sightings);
    }

    @GetMapping("/month")
    public ResponseEntity<List<SightingSummeryResponseDTO>> getMonthData(
            @RequestParam("year") int year,
            @RequestParam("month") int month) {
        List<SightingSummeryResponseDTO> sightings = summeryService.getSightingsForMonth(year, month);
        return ResponseEntity.ok(sightings);
    }

    @GetMapping("/date")
    public ResponseEntity<SightingSummeryResponseDTO> getDateData(
            @RequestParam("date") String date) {
        LocalDate localDate = LocalDate.parse(date);
        SightingSummeryResponseDTO sighting = summeryService.getSightingsForDate(localDate);
        return ResponseEntity.ok(sighting);
    }

    @GetMapping("/hotspots")
    public List<AnimalHotspotDTO> getHotspots() {
        return service.getAnimalHotspots();
    }

    @GetMapping("/time-distribution")
    public ResponseEntity<List<SightingTimeDTO>> getSightingsByTimeDistribution(@RequestParam String animal) {
        List<SightingTimeDTO> dtos = service.getSightingsByTimeDistribution(animal);
        return ResponseEntity.ok(dtos);
    }
}