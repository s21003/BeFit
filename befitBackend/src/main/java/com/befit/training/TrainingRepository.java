package com.befit.training;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TrainingRepository extends JpaRepository<Training,Long> {
    List<Training> findByUserUsername(String username);
    Optional<Training> findById(Long id);
}
