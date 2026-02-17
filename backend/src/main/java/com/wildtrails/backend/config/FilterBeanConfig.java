package com.wildtrails.backend.config;

import com.google.firebase.auth.FirebaseAuth;
import com.wildtrails.backend.security.FirebaseAuthenticationFilter;
import com.wildtrails.backend.service.FirebaseUserService;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterBeanConfig {

    @Bean
    public FirebaseAuthenticationFilter firebaseAuthenticationFilter(
            FirebaseAuth firebaseAuth,
            FirebaseUserService firebaseUserService
    ) {
        return new FirebaseAuthenticationFilter(firebaseAuth, firebaseUserService);
    }

    @Bean
    public FilterRegistrationBean<FirebaseAuthenticationFilter> disableFirebaseFilterAutoRegistration(
            FirebaseAuthenticationFilter firebaseAuthenticationFilter
    ) {
        FilterRegistrationBean<FirebaseAuthenticationFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(firebaseAuthenticationFilter);
        registration.setEnabled(false); // disables default registration
        return registration;
    }
}
