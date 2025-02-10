package com.befit.exercise;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise,Long>{
    List<Exercise> findByCreatorUsername(String username);

    List<Exercise> findByCreatorUsernameOrCreatorUsernameIsNull(String username);
}
