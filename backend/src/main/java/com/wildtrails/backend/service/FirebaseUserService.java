package com.wildtrails.backend.service;

import com.google.firebase.auth.FirebaseToken;
import com.wildtrails.backend.entity.Customer;
import com.wildtrails.backend.entity.Role;
import com.wildtrails.backend.entity.User;
import com.wildtrails.backend.repository.CustomerRepository;
import com.wildtrails.backend.repository.UserRepository;
import jakarta.servlet.ServletException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class FirebaseUserService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    @Transactional
    public User saveOrUpdateUserAndCustomer(FirebaseToken decodedToken) throws ServletException {
        String email = decodedToken.getEmail();
        String name = decodedToken.getName() != null ? decodedToken.getName() : "Unknown";

        Optional<User> existingUserOpt = userRepository.findByEmail(email);
        User user;

        if (existingUserOpt.isEmpty()) {
            user = User.builder()
                    .email(email)
                    .name(name)
                    .role(Role.CUSTOMER)
                    .password("firebase_user") // dummy password
                    .build();

            try {
                user = userRepository.save(user);
                log.info("Saved new user with email: {}", email);
            } catch (Exception e) {
                log.error("Failed to save user with email: {}", email, e);
                throw new ServletException("Failed to save user", e);
            }

            Customer customer = new Customer();
            customer.setUser(user);
            customer.setLoyalty_points(0);
            customer.setPhone_number("");
            customer.setAddress("");
            customer.setPhoto_url("");

            try {
                customerRepository.save(customer);
                log.info("Saved new customer for user with email: {}", email);
            } catch (Exception e) {
                log.error("Failed to save customer for user with email: {}", email, e);
                throw new ServletException("Failed to save customer", e);
            }

        } else {
            user = existingUserOpt.get();
            log.info("Found existing user with email: {}", email);

            if (!customerRepository.existsByUser(user)) {
                Customer customer = new Customer();
                customer.setUser(user);
                customer.setLoyalty_points(0);
                customer.setPhone_number("");
                customer.setAddress("");
                customer.setPhoto_url("");

                try {
                    customerRepository.save(customer);
                    log.info("Created new customer for existing user: {}", email);
                } catch (Exception e) {
                    log.error("Failed to save customer for existing user with email: {}", email, e);
                    throw new ServletException("Failed to save customer", e);
                }
            } else {
                log.info("User and customer already exist for email: {}", email);
            }
        }

        return user;
    }
}
