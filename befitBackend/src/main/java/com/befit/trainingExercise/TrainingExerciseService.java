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
    public TrainingExercise createTrainingExercise(TrainingExercise tse){
        TrainingExercise trainingExercise = new TrainingExercise();
        trainingExercise.setExerciseId(tse.getExerciseId());
        trainingExercise.setTrainingSchemaId(tse.getTrainingSchemaId());
        trainingExercise.setSeries(tse.getSeries());
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
    public String editTrainingExercise(TrainingExercise tse, Long id){
        Optional<TrainingExercise> tmp = singleTrainingExercise(id);
        if (tmp.isEmpty()){
            return "WrongId";
        }else{
            TrainingExercise trainingExercise = tmp.get();
            trainingExercise.setExerciseId(tse.getExerciseId());
            trainingExercise.setTrainingSchemaId(tse.getTrainingSchemaId());
            trainingExercise.setSeries(tse.getSeries());
            trainingExerciseRepository.save(trainingExercise);
            return "Updated";
        }
    }
    public Optional<TrainingExercise> singleTrainingExercise(Long id) { return trainingExerciseRepository.findById(id); }

    public String dropTraining(Long id) {
        List<TrainingExercise> all = trainingExerciseRepository.findAll();
        String flag = "ERROR with delete";
        for (int i = 0; i < all.size(); i++) {
            if (Objects.equals(all.get(i).getTrainingSchemaId(), id)){
                trainingExerciseRepository.deleteById(all.get(i).getId());
                flag = "Deleted";
            } else {
                flag = "Wrong id";
            }
        }
        return flag;
    }
}
