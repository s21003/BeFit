package com.befit.trainingSchemaExercise;

import org.springframework.beans.factory.annotation.Autowired;
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
        Optional<TrainingSchemaExercise> tmp = singleTrainingSchemaExercise(id);
        if (tmp.isEmpty()){
            return "WrongId";
        }else{
            TrainingSchemaExercise trainingSchemaExercise = tmp.get();
            if(trainingSchemaExercise.getExerciseId() != tse.getExerciseId()) {
                trainingSchemaExercise.setExerciseId(tse.getExerciseId());
            }
            if (trainingSchemaExercise.getTrainingSchemaId() != tse.getTrainingSchemaId()) {
                trainingSchemaExercise.setTrainingSchemaId(tse.getTrainingSchemaId());
            }
            if (trainingSchemaExercise.getSeriesId() != tse.getSeriesId()) {
                trainingSchemaExercise.setSeriesId(tse.getSeriesId());
            }
            trainingSchemaExerciseRepository.save(trainingSchemaExercise);
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
}
