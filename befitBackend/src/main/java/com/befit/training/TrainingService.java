package com.befit.training;

import com.befit.trainer.Trainer;
import com.befit.trainer.TrainerService;
import com.befit.trainingExercise.TrainingExercise;
import com.befit.trainingSchema.TrainingSchema;
import com.befit.user.User;
import com.befit.userTrainer.UserTrainerDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TrainingService {
    @Autowired
    private TrainingRepository trainingRepository;

    @Autowired
    private TrainerService trainerService;
    public List<Training> allTrainings(){
        return trainingRepository.findAll();
    }

    public Training createTraining(Training tr){
        Training training = new Training();
        training.setUserUsername(tr.getUserUsername());
        training.setCategory(tr.getCategory());
        training.setStartTime(tr.getStartTime());
        training.setEndTime(tr.getEndTime());
        trainingRepository.save(training);
        return training;
    }
    public String dropTraining(Long id){
        if(trainingRepository.findById(id).isEmpty()){
            return "WrongId";
        }
        trainingRepository.deleteById(id);
        return "Deleted";
    }
    public String editTraining(Training t, Long id) {
        Optional<Training> existingTraining = singleTraining(id);
        if (existingTraining.isEmpty()) {
            return "WrongId";
        } else {
            Training updatedTraining = existingTraining.get();
            updatedTraining.setCategory(t.getCategory());
            updatedTraining.setStartTime(t.getStartTime());
            updatedTraining.setEndTime(t.getEndTime());

            trainingRepository.save(updatedTraining);
            return "Updated";
        }
    }

    public Optional<Training> singleTraining(Long id){
        return trainingRepository.findById(id);
    }

    public List<Training> userTrainings(String username){
        return trainingRepository.findByUserUsername(username);
    }

    public String editTrainingExercises(List<TrainingExercise> ids, Long id){
        Optional<Training> tmp = singleTraining(id);
        if (tmp.isEmpty()){
            return "WrongId";
        }else{
            Training training = tmp.get();
            training.setTrainingExerciseIds(ids);

            trainingRepository.save(training);
            return "Updated";
        }
    }

    public Optional<Training> singleTrainingById(Long id) {
        return trainingRepository.findById(id);
    }

    public String addTrainerToTraining(UserTrainerDTO trainerId, Long trainingId) {
        Optional<Training> existingTraining = singleTraining(trainingId);
        Optional<Trainer> trainer = trainerService.singleTrainer(trainerId.getTrainerId());
        if(existingTraining.isEmpty()){
            return "Training doesn't exist";
        } else if (trainer.isEmpty()) {
            return "Wrong trainer id";
        } else {
            Training updatedTraining = existingTraining.get();
            updatedTraining.setTrainerId(trainerId.getTrainerId());
            trainingRepository.save(updatedTraining);
            return "Updated";
        }
    }
}
