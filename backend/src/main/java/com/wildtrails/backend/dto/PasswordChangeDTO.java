package com.wildtrails.backend.dto;

import lombok.Data;
@Data
public class PasswordChangeDTO {
    private String newPassword;
    private String confirmPassword;
}


