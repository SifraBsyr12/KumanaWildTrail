package com.wildtrails.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SOSAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alert_id;

    private double latitude;
    private double longitude;
    
    private String details;

    private LocalDateTime timestamp;

    @Column(nullable = false)
    @Builder.Default
    private boolean isSolved = false;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", nullable = false)
    private Driver driver;
}
