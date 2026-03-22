package com.wildtrails.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "customers")
@Data
public class Customer {

    @Id
    private int id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    private String photo_url;
    private String phone_number;
    private String address;
    private Integer loyalty_points;
}
