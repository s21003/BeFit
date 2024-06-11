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
        training.setUserEmail(tr.getUserEmail());
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
    public String editTraining(Training tr, Long id) {
        Optional<Training> tmp = singleTraining(id);
        if (tmp.isEmpty()) {
            return "WrongId";
        } else {
            Training training = tmp.get();

            if (tr.getTrainingSchema() != null && !training.getTrainingSchema().equals(tr.getTrainingSchema())) {
                training.setTrainingSchema(tr.getTrainingSchema());
            }
            if (tr.getUserEmail() != null && !training.getUserEmail().equals(tr.getUserEmail())) {
                training.setUserEmail(tr.getUserEmail());
            }
            if (tr.getCategory() != null && !training.getCategory().equals(tr.getCategory())) {
                training.setCategory(tr.getCategory());
            }
            if (tr.getStartTime() != null && !training.getStartTime().equals(tr.getStartTime())) {
                training.setStartTime(tr.getStartTime());
            }
            if (tr.getEndTime() != null && !training.getEndTime().equals(tr.getEndTime())) {
                training.setEndTime(tr.getEndTime());
            }

            trainingRepository.save(training);
            return "Updated";
        }
    }

    public Optional<Training> singleTraining(Long id){
        return trainingRepository.findById(id);
    }

    public List<Training> userTrainings(String email){
        return trainingRepository.findByUserEmail(email);
    }

}
