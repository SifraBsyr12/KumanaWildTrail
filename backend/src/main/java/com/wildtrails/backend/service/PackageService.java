package com.wildtrails.backend.service;

import com.wildtrails.backend.dto.PackageRequestDTO;
import com.wildtrails.backend.dto.PackageResponseDTO;
import com.wildtrails.backend.entity.Package;
import com.wildtrails.backend.entity.Package.PackageType;
import com.wildtrails.backend.repository.PackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PackageService {

    private final PackageRepository packageRepository;
    private final String IMAGE_DIR = System.getProperty("user.dir") + "/uploads/images/";

    public PackageResponseDTO createPackage(PackageRequestDTO dto) throws IOException {
        Package pkg = new Package();

        BeanUtils.copyProperties(dto, pkg, "imageFile", "packageType");

        pkg.setPackageType(PackageType.valueOf(dto.getPackageType().toUpperCase()));

        // Save image if uploaded
        if (dto.getImageFile() != null && !dto.getImageFile().isEmpty()) {
            String imagePath = saveImage(dto.getImageFile());
            pkg.setImageUrl(imagePath);
        }

        Package saved = packageRepository.save(pkg);
        return mapToResponse(saved);
    }

    public List<PackageResponseDTO> getAllPackages() {
        return packageRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PackageResponseDTO> getPackagesByType(PackageType type) {
        return packageRepository.findByPackageType(type)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PackageResponseDTO updatePackage(Long id, PackageRequestDTO dto) throws IOException {
        Package pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        // Copy all updatable fields except ID, image, and type
        BeanUtils.copyProperties(dto, pkg, "packageID", "imageUrl", "packageType", "imageFile");

        pkg.setPackageType(PackageType.valueOf(dto.getPackageType().toUpperCase()));

        if (dto.getImageFile() != null && !dto.getImageFile().isEmpty()) {
            String imagePath = saveImage(dto.getImageFile());
            pkg.setImageUrl(imagePath);
        }

        Package updated = packageRepository.save(pkg);
        return mapToResponse(updated);
    }

    public void deletePackage(Long id) {
        packageRepository.deleteById(id);
    }

    private String saveImage(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(IMAGE_DIR);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        file.transferTo(filePath.toFile());

        // return relative path for frontend
        return "/uploads/images/" + fileName;
    }

    private PackageResponseDTO mapToResponse(Package pkg) {
        PackageResponseDTO dto = new PackageResponseDTO();
        BeanUtils.copyProperties(pkg, dto);
        return dto;
    }
}
