package com.wildtrails.backend.service;

import com.wildtrails.backend.dto.SOSAlertDTO;
import com.wildtrails.backend.entity.Driver;
import com.wildtrails.backend.entity.SOSAlert;
import com.wildtrails.backend.repository.SOSAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SOSAlertService {
    private final SOSAlertRepository sosAlertRepository;
    public SOSAlert saveAlert(SOSAlertDTO dto, Driver driver) {
        SOSAlert alert = SOSAlert.builder()
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .timestamp(LocalDateTime.now())
                .details(dto.getDetails()) 
                .isSolved(false)   
                .driver(driver)
                .build();
    
        return sosAlertRepository.save(alert);
    }
    
    public List<SOSAlertDTO> getUnresolvedAlertsForDrivers() {
        return sosAlertRepository.findByIsSolvedFalse().stream().map(alert -> {
            SOSAlertDTO dto = new SOSAlertDTO();
            dto.setAlertId(alert.getAlert_id().intValue());
            dto.setLatitude(alert.getLatitude());
            dto.setLongitude(alert.getLongitude());
            dto.setDetails(alert.getDetails());
            dto.setDriverName(alert.getDriver().getUser().getName());
            return dto;
        }).collect(Collectors.toList());
    }
    
    public void markAsSolved(Long alertId) {
        SOSAlert alert = sosAlertRepository.findById(alertId)
            .orElseThrow(() -> new RuntimeException("SOS Alert not found"));
    
        alert.setSolved(true);
        sosAlertRepository.save(alert);
    }
    
    
}
