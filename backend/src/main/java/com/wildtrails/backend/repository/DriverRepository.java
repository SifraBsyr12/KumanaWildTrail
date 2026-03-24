package com.wildtrails.backend.repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.wildtrails.backend.entity.Driver; 
import com.wildtrails.backend.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DriverRepository extends JpaRepository<Driver, Integer >{
    Optional<Driver> findByUser(User user);
    
    Optional<Driver> findByUser_Email(String email);

    @Query("SELECT d FROM Driver d WHERE d.is_available = true")
    List<Driver> findAvailableDriver();

    @Query("""
    SELECT d FROM Driver d
    WHERE d.is_available = true
    AND d.id NOT IN (
        SELECT b.driver.id FROM Booking b
        WHERE b.bookingDate = :bookingDate
    )
""")
        List<Driver> findAvailableDriversByBookingDate(@Param("bookingDate") LocalDateTime bookingDate);


}
