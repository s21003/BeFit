package com.befit.trainingSchema;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        trainingSchema.setCreatorId(ts.getCreatorId());
        trainingSchema.setExercises(ts.getExercises());
        trainingSchema.setCreationDate(ts.getCreationDate());
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
        Optional<TrainingSchema> tmp = singleTrainingSchema(id);
        if (tmp.isEmpty()){
            return "WrongId";
        }else{
            TrainingSchema trainingSchema = tmp.get();
            if (trainingSchema.getCreatorId() != ts.getCreatorId()){
                trainingSchema.setCreatorId(ts.getCreatorId());
            }
            if (trainingSchema.getExercises() != ts.getExercises()){
                trainingSchema.setExercises(ts.getExercises());
            }
            if (trainingSchema.getCreationDate() != ts.getCreationDate()){
                trainingSchema.setCreationDate(ts.getCreationDate());
            }
            trainingSchemaRepository.save(trainingSchema);
            return "Updated";
        }
    }
    public Optional<TrainingSchema> singleTrainingSchema(Long id){
        return trainingSchemaRepository.findById(id);
    }
}
