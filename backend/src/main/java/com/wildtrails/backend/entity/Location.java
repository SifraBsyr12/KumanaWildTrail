package com.wildtrails.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class Location {
    @Column(nullable = true)
    private Double lat;

    @Column(nullable = true)
    private Double lng;
}