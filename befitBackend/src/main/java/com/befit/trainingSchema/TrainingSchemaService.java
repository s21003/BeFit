package com.befit.trainingSchema;

import com.befit.training.TrainingCategory;
import com.befit.trainingSchemaExercise.TrainingSchemaExercise;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class TrainingSchemaService {
    @Autowired
    private TrainingSchemaRepository trainingSchemaRepository;
    public List<TrainingSchema> allTrainingSchemas(){
        return trainingSchemaRepository.findAll();
    }
    public TrainingSchema createTrainingSchema(TrainingSchema ts){
        TrainingSchema trainingSchema = new TrainingSchema();
        trainingSchema.setCategory(ts.getCategory());
        trainingSchema.setName(ts.getName());
        trainingSchema.setCreationDate(LocalDate.now());
        trainingSchema.setCreatorUsername(ts.getCreatorUsername());

        trainingSchemaRepository.save(trainingSchema);
        return trainingSchema;
    }
    public String dropTrainingSchema(Long id){
        if(trainingSchemaRepository.findById(id).isEmpty()){
            return "WrongId";
        }
        trainingSchemaRepository.deleteById(id);
        return "Deleted";
    }
    public String editTrainingSchema(TrainingSchema ts, Long id){
        Optional<TrainingSchema> existingTrainingSchema = singleTrainingSchema(id);
        if (existingTrainingSchema.isEmpty()){
            return "WrongId";
        }else{
            TrainingSchema updatedTrainingSchema = existingTrainingSchema.get();
            updatedTrainingSchema.setCategory(ts.getCategory());
            updatedTrainingSchema.setName(ts.getName());
            updatedTrainingSchema.setCreationDate(ts.getCreationDate());

            trainingSchemaRepository.save(updatedTrainingSchema);
            return "Updated";
        }
    }

    public String editTrainingSchemaExercises(List<TrainingSchemaExercise> ids, Long id){
        Optional<TrainingSchema> tmp = singleTrainingSchema(id);
        if (tmp.isEmpty()){
            return "WrongId";
        }else{
            TrainingSchema trainingSchema = tmp.get();
            trainingSchema.setTrainingSchemaExerciseIds(ids);

            trainingSchemaRepository.save(trainingSchema);
            return "Updated";
        }
    }

    public List<TrainingCategory> getCategories(){ return Arrays.asList(TrainingCategory.values()); }

    public Optional<TrainingSchema> singleTrainingSchema(Long id){
        return trainingSchemaRepository.findById(id);
    }

    public List<TrainingSchema> getUsersTrainingSchemas(String username) {
        return trainingSchemaRepository.findByCreatorUsername(username);
    }
}
