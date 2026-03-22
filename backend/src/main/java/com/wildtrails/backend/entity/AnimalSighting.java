package com.wildtrails.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "animal_sightings")
public class AnimalSighting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sighting_id")
    private Long sightingId;

    @Column(name = "animal_name")
    private String animalName;

    @Column(name = "date_time", nullable = true)
    private LocalDateTime dateTime;

    @Column(length = 1000, nullable = true)
    private String notes;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "lat", column = @Column(nullable = true)),
        @AttributeOverride(name = "lng", column = @Column(nullable = true))
    })
    private Location location;

    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false) // Changed from "id"
    private Driver submittedBy;

}