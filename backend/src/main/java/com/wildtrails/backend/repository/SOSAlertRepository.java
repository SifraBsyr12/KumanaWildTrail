package com.wildtrails.backend.repository;

import com.wildtrails.backend.entity.SOSAlert;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SOSAlertRepository extends JpaRepository<SOSAlert, Long> {
    List<SOSAlert> findByTimestampAfter(LocalDateTime time);
    List<SOSAlert> findByIsSolvedFalse();
    List<SOSAlert> findByIsSolved(boolean isSolved);

}
