package com.wildtrails.backend.repository;

import com.wildtrails.backend.entity.Package;
import com.wildtrails.backend.entity.Package.PackageType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackageRepository extends JpaRepository<Package, Long> {
    List<Package> findByPackageType(PackageType type);
}
