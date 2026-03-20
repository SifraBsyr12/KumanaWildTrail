package com.wildtrails.backend.dto;
import lombok.Data;

import java.util.Map;

@Data
public class SightingSummeryResponseDTO {
    private String date;
    private Map<String, Integer> animals;
    private Map<String, LocationDTO> locations;

    @Data
    public static class LocationDTO {
        private Double lat;
        private Double lon;
        private String name;

        public LocationDTO(Double lat, Double lon, String name) {
            this.lat = lat;
            this.lon = lon;
            this.name = name;
        }
    }
}