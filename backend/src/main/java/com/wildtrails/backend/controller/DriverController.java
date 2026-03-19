package com.wildtrails.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.security.Principal;
import java.util.UUID;

import com.wildtrails.backend.repository.DriverRepository;
import com.wildtrails.backend.service.DriverService;
import com.wildtrails.backend.dto.DriverDTO;
import com.wildtrails.backend.dto.PasswordChangeDTO;
import com.wildtrails.backend.entity.Driver;

@RestController
@RequestMapping("/api/driver")
public class DriverController {

    @Autowired
    private DriverRepository driverRepository;
    @Autowired
    private DriverService driverService;

    @PostMapping("/update/photo")
    public ResponseEntity<String> uploadPhoto(@RequestParam("file") MultipartFile file, Authentication auth) throws IOException {
        System.out.println("Received file: " + file.getOriginalFilename());
        String email = auth.getName();
        Driver driver = driverRepository.findByUser_Email(email)
                .orElseThrow(() -> new UsernameNotFoundException("Driver not found"));

        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
        Path uploadPath = Paths.get("uploads/");
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String url = "/uploads/" + fileName;
        driver.setPhoto_url(url);
        driverRepository.save(driver);

        return ResponseEntity.ok(url);
    }

    @GetMapping("/get_loggedin")
    public ResponseEntity<DriverDTO> getLoggedInDriver(Authentication auth) {
    String email = auth.getName();
    Driver driver = driverRepository.findByUser_Email(email)
            .orElseThrow(() -> new UsernameNotFoundException("Driver not found"));

    DriverDTO dto = new DriverDTO();
    dto.setIsAvailable(driver.is_available());
    dto.setVehicle_type(driver.getVehicle_type()); 
    dto.setPhoto_url(driver.getPhoto_url()); 
    return ResponseEntity.ok(dto);
}
@PutMapping("/update/settings")
public ResponseEntity<?> updateSettings(@RequestBody DriverDTO dto, Principal principal) {
    String email = principal.getName();
    driverService.updateDriverSettings(email, dto);
    return ResponseEntity.ok("Settings updated successfully");
}
@PutMapping("/change-password")
public ResponseEntity<?> changePassword(@RequestBody PasswordChangeDTO dto, Principal principal) {
    String email = principal.getName();
    driverService.changePassword(email, dto);
    return ResponseEntity.ok("Password updated successfully");
}


}

