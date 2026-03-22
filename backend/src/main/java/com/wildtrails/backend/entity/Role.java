package com.wildtrails.backend.entity;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

public enum Role {
    ADMIN,
    DRIVER,
    CUSTOMER;
    
    public SimpleGrantedAuthority toAuthority() {
        return new SimpleGrantedAuthority("ROLE_" + this.name());
    }
}