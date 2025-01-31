package com.befit.userTrainer;

import com.befit.userTrainer.UserTrainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatusCode;

import java.util.List;
import java.util.Optional;

public interface UserTrainerRepository extends JpaRepository<UserTrainer,Long> {
    List<UserTrainer> findByTrainerIdAndStatus(Long trainerId, CooperationStatus status);

    List<UserTrainer> findByTrainerId(Long trainerId);

    List<UserTrainer> findByUserId(Long userId);

    Optional<UserTrainer> findByTrainerIdAndUserId(Long trainerId, Long userId);

    List<UserTrainer> findByUserIdAndStatus(Long userId, CooperationStatus status);

    void deleteByUserIdAndTrainerId(Long studentId, Long id);
}
