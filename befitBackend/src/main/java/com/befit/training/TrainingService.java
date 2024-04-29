package com.befit.training;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TrainingService {
    @Autowired
    private TrainingRepository trainingRepository;
    public List<Training> allTrainings(){
        return trainingRepository.findAll();
    }
    public Training createTraining(Training tr){
        Training training = new Training();
        training.setTrainingSchema(tr.getTrainingSchema());
        training.setUserId(tr.getUserId());
        training.setCategory(tr.getCategory());
        training.setDate(tr.getDate());
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
    public String editTraining(Training tr, Long id){
        Optional<Training> tmp = singleTraining(id);
        if (tmp.isEmpty()){
            return "WrongId";
        }else{
            Training training = tmp.get();
            if (training.getTrainingSchema() != tr.getTrainingSchema()){
                training.setTrainingSchema(tr.getTrainingSchema());
            }
            if (training.getUserId() != tr.getUserId()){
                training.setUserId(tr.getUserId());
            }
            if (training.getCategory() != tr.getCategory()){
                training.setCategory(tr.getCategory());
            }
            if (training.getDate() != tr.getDate()){
                training.setDate(tr.getDate());
            }
            trainingRepository.save(training);
            return "Updated";
        }
    }
    public Optional<Training> singleTraining(Long id){
        return trainingRepository.findById(id);
    }

}
