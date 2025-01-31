package com.befit.trainingSchemaExercise;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class TrainingSchemaExerciseService {
    @Autowired
    private TrainingSchemaExerciseRepository trainingSchemaExerciseRepository;
    public List<TrainingSchemaExercise> allTrainingSchemaExercise() { return trainingSchemaExerciseRepository.findAll(); }
    public TrainingSchemaExercise createTrainingSchemaExercise(TrainingSchemaExercise tse){
        TrainingSchemaExercise trainingSchemaExercise = new TrainingSchemaExercise();
        trainingSchemaExercise.setExerciseId(tse.getExerciseId());
        trainingSchemaExercise.setTrainingSchemaId(tse.getTrainingSchemaId());
        trainingSchemaExercise.setSeriesId(tse.getSeriesId());
        trainingSchemaExerciseRepository.save(trainingSchemaExercise);
        return trainingSchemaExercise;
    }
    public String dropTrainingSchemaExercise(Long id){
        if (trainingSchemaExerciseRepository.findById(id).isEmpty()){
            return "WrongId";
        }
        trainingSchemaExerciseRepository.deleteById(id);
        return "Deleted";
    }
    public String editTrainingSchemaExercise(TrainingSchemaExercise tse, Long id){
        Optional<TrainingSchemaExercise> existingtse = singleTrainingSchemaExercise(id);
        if (existingtse.isEmpty()){
            return "WrongId";
        }else{
            TrainingSchemaExercise updatedtse = existingtse.get();
            updatedtse.setExerciseId(tse.getExerciseId());
            updatedtse.setTrainingSchemaId(tse.getTrainingSchemaId());
            updatedtse.setSeriesId(tse.getSeriesId());

            trainingSchemaExerciseRepository.save(updatedtse);
            return "Updated";
        }
    }
    public Optional<TrainingSchemaExercise> singleTrainingSchemaExercise(Long id) { return trainingSchemaExerciseRepository.findById(id); }

    public String dropTrainingSchema(Long id) {
        List<TrainingSchemaExercise> all = trainingSchemaExerciseRepository.findAll();
        String flag = "ERROR with delete";
        for (int i = 0; i < all.size(); i++) {
            if (Objects.equals(all.get(i).getTrainingSchemaId(), id)){
                trainingSchemaExerciseRepository.deleteById(all.get(i).getId());
                flag = "Deleted";
            } else {
                flag = "Wrong id";
            }
        }
        return flag;
    }

    public List<TrainingSchemaExercise> getTrainingSchemaExerciseForTrainingSchemaId(Long id) {
        return trainingSchemaExerciseRepository.findByTrainingSchemaId(id);
    }
}
