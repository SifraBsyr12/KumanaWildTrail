package com.wildtrails.backend.controller;

import com.wildtrails.backend.entity.Package;
import com.wildtrails.backend.service.PackageService;
import com.wildtrails.backend.dto.PackageResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/packages")
public class PackageController {

    private final PackageService packageService;
    public PackageController(PackageService service, PackageService packageService) {
        this.packageService = packageService;
    }
    @GetMapping
    public ResponseEntity<List<PackageResponseDTO>> getAllPackages() {
        return ResponseEntity.ok(packageService.getAllPackages());
    }

    @GetMapping("/getAllsafari")
    public ResponseEntity<List<PackageResponseDTO>> getSafariPackages() {
        String type = "SAFARI";
        return ResponseEntity.ok(packageService.getPackagesByType(Package.PackageType.valueOf(type)));
    }

}
