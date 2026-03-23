package com.wildtrails.backend.service;

import com.wildtrails.backend.dto.AuthResponse;
import com.wildtrails.backend.dto.RegisterRequest;
import com.wildtrails.backend.entity.Driver;
import com.wildtrails.backend.entity.Role;
import com.wildtrails.backend.entity.User;
import com.wildtrails.backend.repository.DriverRepository;
import com.wildtrails.backend.repository.UserRepository;
import com.wildtrails.backend.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final DriverRepository driverRepository;

    public String login(String email, String password) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
        return jwtUtil.generateToken(auth);
    }

    public AuthResponse registerDriver(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
    
        // 1. Create and save User with DRIVER role
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.DRIVER)
                .build();
    
        user = userRepository.save(user); 
    
        // 2. Create and save Driver
        Driver driver = new Driver();
        driver.setUser(user); 
        driver.setVehicle_type(request.getVehicleType());
        driver.setSeating_capacity(request.getSeatingCapacity());
        driver.set_available(true); 
        driverRepository.save(driver); 

        return AuthResponse.builder()
                .message("Driver registered successfully")
                .build();
    }
    
    

    public AuthResponse registerAdmin(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(
                new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword()));

        return new AuthResponse(token);
    }
}
