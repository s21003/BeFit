package com.befit.mealSchema;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MealSchemaRepository extends JpaRepository<MealSchema,Long> {
}
