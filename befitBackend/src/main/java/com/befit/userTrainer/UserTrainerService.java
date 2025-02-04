package com.befit.userTrainer;

import com.befit.mealSchema.MealSchema;
import com.befit.mealSchema.MealSchemaRepository;
import com.befit.trainer.Trainer;
import com.befit.trainingSchema.TrainingSchema;
import com.befit.trainingSchema.TrainingSchemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserTrainerService {
    @Autowired
    private UserTrainerRepository userTrainerRepository;
    @Autowired
    private MealSchemaRepository mealSchemaRepository;
    @Autowired
    private TrainingSchemaRepository trainingSchemaRepository;

    public List<UserTrainer> allUserTrainers() {
        return userTrainerRepository.findAll();
    }

    public UserTrainer createUserTrainer(UserTrainer ut) {
        UserTrainer userTrainer = new UserTrainer();
        userTrainer.setUserId(ut.getUserId());
        userTrainer.setTrainerId(ut.getTrainerId());
        userTrainerRepository.save(userTrainer);
        return userTrainer;
    }

    public String dropUserTrainer(Long id) {
        if (userTrainerRepository.findById(id).isEmpty()) {
            return "WrongId";
        }
        userTrainerRepository.deleteById(id);
        return "Deleted";
    }

    public String editUserTrainer(UserTrainer ut, Long id) {
        Optional<UserTrainer> existingUserTrainer = singleUserTrainer(id);
        if (existingUserTrainer.isEmpty()) {
            return "WrongId";
        } else {
            UserTrainer updatedUserTrainer = existingUserTrainer.get();
            updatedUserTrainer.setTrainerId(ut.getTrainerId());
            updatedUserTrainer.setUserId(ut.getUserId());
            updatedUserTrainer.setStatus(ut.getStatus());
            userTrainerRepository.save(updatedUserTrainer);
            return "Updated";
        }
    }

    public Optional<UserTrainer> singleUserTrainer(Long id) {
        return userTrainerRepository.findById(id);
    }

    public UserTrainer newRequest(Long userId, Long trainerId) {
        UserTrainer userTrainer = new UserTrainer();
        userTrainer.setUserId(userId);
        userTrainer.setTrainerId(trainerId);
        userTrainer.setStatus(CooperationStatus.PENDING);
        userTrainerRepository.save(userTrainer);
        return userTrainer;
    }

    public String updateRequestStatus(Long id, RequestStatusDTO st) {
        String status = st.getStatus();

        Optional<UserTrainer> existingUserTrainer = userTrainerRepository.findById(id);
        if (existingUserTrainer.isPresent()) {
            UserTrainer userTrainer = existingUserTrainer.get();

            try {
                CooperationStatus updatedStatus = CooperationStatus.valueOf(status);

                userTrainer.setStatus(updatedStatus);
                System.out.println("updatedStatus: "+updatedStatus);

                userTrainer.setTimestamp(LocalDate.now());
                System.out.println("userTrainer.timestamp: "+userTrainer.getTimestamp() );// Use LocalDateTime for full date + time
                userTrainerRepository.save(userTrainer);

                return ("Status updated to " + status);
            } catch (IllegalArgumentException e) {
                // Handle invalid status
                return ("Invalid status: " + status);
            }
        } else {
            return ("Request not found");
        }
    }

    public List<UserTrainer> getAcceptedRequests(Long trainerId) {
        return userTrainerRepository.findByTrainerIdAndStatus(trainerId, CooperationStatus.ACCEPTED);
    }

    public List<UserTrainer> getTrainerRequests(Long trainerId) {
        return userTrainerRepository.findByTrainerId(trainerId);
    }

    public Optional<UserTrainer> singleUserTrainerByUserId(Long trainerId, Long userId) {
        return userTrainerRepository.findByTrainerIdAndUserId(trainerId, userId);
    }

    public List<UserTrainer> getStudentsTrainers(Long userId) {
        return userTrainerRepository.findByUserId(userId);
    }


    public List<UserTrainer> getAcceptedTrainers(Long userId) {
        return userTrainerRepository.findByUserIdAndStatus(userId, CooperationStatus.ACCEPTED);
    }

    public String deleteStudent(Long studentId, UserTrainerDTO trainer) {
        Optional<UserTrainer> userTrainer = userTrainerRepository.findByTrainerIdAndUserId(trainer.getTrainerId(), studentId);

        if (userTrainer.isEmpty()) {
            return "No such student-trainer relationship found.";
        }

        userTrainerRepository.delete(userTrainer.get());
        return "Deleted successfully";
    }

    public String deleteTrainer(Long trainerId, UserStudentDTO student) {
        Optional<UserTrainer> userTrainer = userTrainerRepository.findByTrainerIdAndUserId(trainerId, student.getUserId());

        if (userTrainer.isEmpty()) {
            return "No such student-trainer relationship found.";
        }

        userTrainerRepository.delete(userTrainer.get());
        return "Deleted successfully";
    }

    public String shareMealSchemas(Long userTrainerId, List<Long> mealSchemaIds) {
        Optional<UserTrainer> userTrainerOptional = userTrainerRepository.findById(userTrainerId);
        if (userTrainerOptional.isPresent()) {
            UserTrainer userTrainer = userTrainerOptional.get();

            List<MealSchema> mealSchemas = mealSchemaRepository.findAllById(mealSchemaIds);
            List<MealSchema> sharedMealSchemas = userTrainer.getSharedMealSchemas();

            for (MealSchema mealSchema: mealSchemas) {
                if (!sharedMealSchemas.contains(mealSchema)) { // Check if already present
                    sharedMealSchemas.add(mealSchema);
                }
            }

            userTrainerRepository.save(userTrainer);
            return "Meal schemas shared successfully";
        }
        return "UserTrainer not found";
    }

    public String shareTrainingSchemas(Long userTrainerId, List<Long> trainingSchemaIds) {
        Optional<UserTrainer> userTrainerOptional = userTrainerRepository.findById(userTrainerId);
        if (userTrainerOptional.isPresent()) {
            UserTrainer userTrainer = userTrainerOptional.get();

            List<TrainingSchema> trainingSchemas = trainingSchemaRepository.findAllById(trainingSchemaIds); // Assuming you have TrainingSchemaRepository
            userTrainer.setSharedTrainingSchemas(trainingSchemas);

            userTrainerRepository.save(userTrainer);
            return "Training schemas shared successfully";
        }
        return "UserTrainer not found";
    }

    public List<MealSchema> getSharedMealSchemasForStudent(Long userId) {
        List<UserTrainer> userTrainers = userTrainerRepository.findByUserId(userId);
        List<MealSchema> sharedSchemas = new ArrayList<>();

        for (UserTrainer userTrainer: userTrainers) {
            sharedSchemas.addAll(userTrainer.getSharedMealSchemas());
        }

        return sharedSchemas;
    }

    public String removeSharedMealSchema(Long userTrainerId, Long mealSchemaId) {
        Optional<UserTrainer> userTrainerOptional = userTrainerRepository.findById(userTrainerId);
        if (userTrainerOptional.isPresent()) {
            UserTrainer userTrainer = userTrainerOptional.get();
            List<MealSchema> sharedMealSchemas = userTrainer.getSharedMealSchemas();

            sharedMealSchemas.removeIf(mealSchema -> mealSchema.getId() == mealSchemaId);

            userTrainerRepository.save(userTrainer);
            return "Meal schema removed successfully";
        }
        return "UserTrainer not found";
    }

    public String removeSharedTrainingSchema(Long userTrainerId, Long trainingSchemaId) {

        System.out.println();
        System.out.println("Usuwanko");
        System.out.println();
        Optional<UserTrainer> userTrainerOptional = userTrainerRepository.findById(userTrainerId);
        if (userTrainerOptional.isPresent()) {
            UserTrainer userTrainer = userTrainerOptional.get();
            List<TrainingSchema> sharedTrainingSchemas = userTrainer.getSharedTrainingSchemas();

            sharedTrainingSchemas.removeIf(trainingSchema -> trainingSchema.getId() == trainingSchemaId);

            userTrainerRepository.save(userTrainer);
            return "Training schema removed successfully";
        }
        return "UserTrainer not found";
    }

    public List<TrainingSchema> getSharedTrainingSchemasForStudent(Long userId) {
        List<UserTrainer> userTrainers = userTrainerRepository.findByUserId(userId);
        List<TrainingSchema> sharedSchemas = new ArrayList<>();

        for (UserTrainer userTrainer: userTrainers) {
            sharedSchemas.addAll(userTrainer.getSharedTrainingSchemas());
        }

        return sharedSchemas;
    }
}
