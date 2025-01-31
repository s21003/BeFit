package com.befit.trainingSchemaExercise;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainingSchemaExerciseRepository extends JpaRepository<TrainingSchemaExercise, Long> {
    List<TrainingSchemaExercise> findByTrainingSchemaId(Long id);
}
