package com.wildtrails.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.wildtrails.backend.repository.DriverRepository;
import com.wildtrails.backend.repository.UserRepository;
import com.wildtrails.backend.dto.DriverDTO;
import com.wildtrails.backend.dto.PasswordChangeDTO;
import com.wildtrails.backend.entity.Driver;
import com.wildtrails.backend.entity.User;

import java.util.Optional;

@Service
public class DriverService {

    private final DriverRepository driverRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DriverService(DriverRepository driverRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void updateDriverSettings(String email, DriverDTO dto) {
        Optional<Driver> optionalDriver = driverRepository.findByUser_Email(email);
        if (optionalDriver.isEmpty()) {
            throw new UsernameNotFoundException("Driver not found");
        }
        Driver driver = optionalDriver.get();

        if (dto.getIsAvailable() != null) {
            driver.set_available(dto.getIsAvailable());
        }
        if (dto.getVehicle_type() != null) {
            driver.setVehicle_type(dto.getVehicle_type());
        }
        if (dto.getSeating_capacity() > 0) {
            driver.setSeating_capacity(dto.getSeating_capacity());
        }

        driverRepository.save(driver);
    }

    public void changePassword(String email, PasswordChangeDTO dto) {
        Optional<Driver> optionalDriver = driverRepository.findByUser_Email(email);
        if (optionalDriver.isEmpty()) {
            throw new UsernameNotFoundException("Driver not found");
        }
    
        Driver driver = optionalDriver.get();
        User user = driver.getUser(); 
    
        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new IllegalArgumentException("New passwords do not match");
        }
    
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }
    
}
