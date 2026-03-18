    package com.wildtrails.backend.controller;

    import com.wildtrails.backend.dto.PackageRequestDTO;
    import com.wildtrails.backend.dto.PackageResponseDTO;
    import com.wildtrails.backend.entity.Package.PackageType;
    import com.wildtrails.backend.service.PackageService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.web.bind.annotation.*;

    import java.io.IOException;
    import java.util.List;

    @RestController
    @RequestMapping("/api/admin/packages")
    @PreAuthorize("hasAnyRole('ADMIN')")
    @RequiredArgsConstructor
    public class AdminPackageController {

        private final PackageService packageService;

        @PreAuthorize("hasRole('ADMIN')")
        @PostMapping
        public ResponseEntity<PackageResponseDTO> createPackage(@ModelAttribute PackageRequestDTO dto) throws IOException {
            return ResponseEntity.ok(packageService.createPackage(dto));
        }

        @PreAuthorize("hasRole('ADMIN')")
        @PutMapping("/{id}")
        public ResponseEntity<PackageResponseDTO> updatePackage(@PathVariable Long id, @ModelAttribute PackageRequestDTO dto) throws IOException {
            return ResponseEntity.ok(packageService.updatePackage(id, dto));
        }

        @PreAuthorize("hasRole('ADMIN')")
        @DeleteMapping("/{id}")
        public ResponseEntity<String> deletePackage(@PathVariable Long id) {
            packageService.deletePackage(id);
            return ResponseEntity.ok("Package deleted successfully.");
        }

        @PreAuthorize("hasRole('ADMIN')")
        @GetMapping
        public ResponseEntity<List<PackageResponseDTO>> getAllPackages() {
            return ResponseEntity.ok(packageService.getAllPackages());
        }

        @PreAuthorize("hasRole('ADMIN')")
        @GetMapping("/type/{type}")
        public ResponseEntity<List<PackageResponseDTO>> getPackagesByType(@PathVariable PackageType type) {
            return ResponseEntity.ok(packageService.getPackagesByType(type));
        }
    }
