package com.befit.trainingExercise;

import com.befit.trainingSchemaExercise.TrainingSchemaExercise;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class TrainingExerciseService {
    @Autowired
    private TrainingExerciseRepository trainingExerciseRepository;
    public List<TrainingExercise> allTrainingExercies() { return trainingExerciseRepository.findAll(); }
    public TrainingExercise createTrainingExercise(TrainingExercise te){
        TrainingExercise trainingExercise = new TrainingExercise();
        trainingExercise.setExerciseId(te.getExerciseId());
        trainingExercise.setTrainingId(te.getTrainingId());
        trainingExercise.setSeriesId(te.getSeriesId());
        trainingExerciseRepository.save(trainingExercise);
        return trainingExercise;
    }
    public String dropTrainingExercise(Long id){
        if (trainingExerciseRepository.findById(id).isEmpty()){
            return "WrongId";
        }
        trainingExerciseRepository.deleteById(id);
        return "Deleted";
    }
    public String editTrainingExercise(TrainingExercise te, Long id){
        Optional<TrainingExercise> existingTrainingExercise = singleTrainingExercise(id);
        if (existingTrainingExercise.isEmpty()){
            return "WrongId";
        }else{
            TrainingExercise updatedTrainingExercise = existingTrainingExercise.get();
            updatedTrainingExercise.setExerciseId(te.getExerciseId());
            updatedTrainingExercise.setTrainingId(te.getTrainingId());
            updatedTrainingExercise.setSeriesId(te.getSeriesId());

            trainingExerciseRepository.save(updatedTrainingExercise);
            return "Updated";
        }
    }
    public Optional<TrainingExercise> singleTrainingExercise(Long id) { return trainingExerciseRepository.findById(id); }

    public String dropTraining(Long id) {
        List<TrainingExercise> all = trainingExerciseRepository.findAll();
        String flag = "ERROR with delete";
        for (int i = 0; i < all.size(); i++) {
            if (Objects.equals(all.get(i).getTrainingId(), id)){
                trainingExerciseRepository.deleteById(all.get(i).getId());
                flag = "Deleted";
            } else {
                flag = "Wrong id";
            }
        }
        return flag;
    }
}
