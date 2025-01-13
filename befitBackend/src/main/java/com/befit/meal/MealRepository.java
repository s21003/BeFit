package com.befit.meal;

import com.befit.training.Training;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal,Long> {
    List<Meal> findByUserUsername(String username);

}
