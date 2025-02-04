package com.befit.trainingSchema;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainingSchemaRepository extends JpaRepository<TrainingSchema,Long> {
    List<TrainingSchema> findByCreatorUsername(String username);
}
