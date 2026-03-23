package com.wildtrails.backend.service;

import com.wildtrails.backend.entity.Customer;
import com.wildtrails.backend.entity.Role;
import com.wildtrails.backend.entity.User;
import com.wildtrails.backend.repository.UserRepository;
import com.wildtrails.backend.security.CustomUserDetails;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return new CustomUserDetails(user);
    }


    public User loadOrCreateCustomer(String email, String name) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name != null ? name : "Firebase User");
            newUser.setPassword("defaultPassword"); // fallback
            newUser.setRole(Role.CUSTOMER);

            Customer customer = new Customer();
            customer.setUser(newUser);
            customer.setLoyalty_points(0);
            customer.setPhoto_url(null);
            customer.setPhone_number(null);
            customer.setAddress(null);

            newUser.setCustomer(customer);

            return userRepository.save(newUser); // cascade saves both
        });
    }

}
