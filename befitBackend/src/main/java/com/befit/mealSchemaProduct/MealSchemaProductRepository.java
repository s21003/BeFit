package com.befit.mealSchemaProduct;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MealSchemaProductRepository extends JpaRepository<MealSchemaProduct, Long> {
    List<MealSchemaProduct> findByMealSchemaId(Long mealSchemaId);
}

