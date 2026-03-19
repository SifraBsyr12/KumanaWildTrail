package com.wildtrails.backend.controller;

import com.wildtrails.backend.dto.LoginRequest;
import com.wildtrails.backend.dto.RegisterRequest;
import com.wildtrails.backend.entity.User;
import com.wildtrails.backend.repository.UserRepository;
import com.wildtrails.backend.dto.AuthResponse;
import com.wildtrails.backend.service.AuthService;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        String token = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/register/driver")
    public ResponseEntity<AuthResponse> registerDriver(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.registerDriver(request));
    }

    @PostMapping("/register/admin")
    public ResponseEntity<AuthResponse> registerAdmin(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.registerAdmin(request));
    }
    @GetMapping("/lookup")
    public ResponseEntity<?> lookupEmail(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return ResponseEntity.ok(Map.of("role", user.get().getRole().name()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No user found with this email.");
        }
    }
    

}

