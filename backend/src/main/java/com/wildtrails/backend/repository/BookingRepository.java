package com.wildtrails.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.wildtrails.backend.entity.Booking;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findBySafariDateAfter(LocalDateTime date);

}
