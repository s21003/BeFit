package com.befit.mealSchema;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealSchemaRepository extends JpaRepository<MealSchema,Long> {
    List<MealSchema> findByCreatorUsername(String username);
}
