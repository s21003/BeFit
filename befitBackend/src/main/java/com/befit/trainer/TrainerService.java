package com.befit.trainer;

import com.befit.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TrainerService {
    @Autowired
    private TrainerRepository trainerRepository;
    public List<Trainer> allTrainers(){
        return trainerRepository.findAll();
    }
    public Trainer createTrainer(Trainer t){
        Trainer trainer = new Trainer();
        trainerRepository.save(trainer);
        return trainer;
    }
    public String dropTrainer(Long id){
        if(trainerRepository.findById(id).isEmpty()){
            return "WrongId";
        }
        trainerRepository.deleteById(id);
        return "Deleted";
    }
    public Trainer editTrainer(TrainerDTO t) {
        Optional<Trainer> existingTrainer = singleTrainer(t.getId());
        if (existingTrainer.isEmpty()) {
            throw new IllegalArgumentException("Trainer with given ID does not exist");
        }

        Trainer updatedTrainer = existingTrainer.get();
        updatedTrainer.setDescription(t.getDescription());
        updatedTrainer.setSpecializations(t.getSpecializations());

        return trainerRepository.save(updatedTrainer); // Save and return the updated entity
    }




    public Optional<Trainer> singleTrainer(Long id){
        return trainerRepository.findById(id);
    }

    public Optional<Trainer> singleTrainerByUsername(String username) {
        return trainerRepository.findByUser_username(username);
    }

    public List<Specialization> getSpecializations() {
        return Arrays.asList(Specialization.values());
    }


}
