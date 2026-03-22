package com.wildtrails.backend.entity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "drivers")
public class Driver {

    @Id
    private int id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    private String photo_url;
    private String vehicle_type;
    private int seating_capacity;
    private boolean is_available;
}
