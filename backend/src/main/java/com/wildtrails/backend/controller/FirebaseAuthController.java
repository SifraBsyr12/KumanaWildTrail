package com.wildtrails.backend.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.wildtrails.backend.entity.Customer;
import com.wildtrails.backend.entity.Role;
import com.wildtrails.backend.entity.User;
import com.wildtrails.backend.repository.CustomerRepository;
import com.wildtrails.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth/firebase")
@RequiredArgsConstructor
public class FirebaseAuthController {

    private final FirebaseAuth firebaseAuth;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestHeader("Authorization") String authHeader) {
        try {
            String idToken = authHeader.replace("Bearer ", "");
            FirebaseToken token = firebaseAuth.verifyIdToken(idToken);
            String email = token.getEmail();
            String name = token.getName();

            Optional<User> existingUserOpt = userRepository.findByEmail(email);
            User user;

            if (existingUserOpt.isEmpty()) {
                user = User.builder()
                        .email(email)
                        .name(name)
                        .role(Role.CUSTOMER)
                        .password("firebase_user") // placeholder
                        .build();
                user = userRepository.save(user);

                Customer customer = new Customer();
                customer.setUser(user);
                customer.setLoyalty_points(0);
                customer.setPhone_number("");
                customer.setAddress("");
                customer.setPhoto_url("");
                customerRepository.save(customer);
            } else {
                user = existingUserOpt.get();

                // Create Customer if not already linked
                if (!customerRepository.existsByUser(user)) {
                    Customer customer = new Customer();
                    customer.setUser(user);
                    customer.setLoyalty_points(0);
                    customer.setPhone_number("");
                    customer.setAddress("");
                    customer.setPhoto_url("");
                    customerRepository.save(customer);
                }
            }

            return ResponseEntity.ok(user);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid Firebase token: " + e.getMessage());
        }
    }
}
