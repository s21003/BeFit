package com.befit.trainer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TrainerService {
    @Autowired
    private TrainerRepository trainerRepository;
    public List<Trainer> allTrainers(){
        return trainerRepository.findAll();
    }
    public Trainer createTrainer(Trainer t){
        Trainer trainer = new Trainer();
        trainer.setName(t.getName());
        trainer.setSurname(t.getSurname());
        trainer.setAddress(t.getAddress());
        trainer.setPassword(t.getPassword());
        trainer.setSpecializations(t.getSpecializations());
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
    public String editTrainer(Trainer t, Long id) {
        Optional<Trainer> tmp = singleTrainer(id);
        if (tmp.isEmpty()) {
            return "WrongId";
        } else {
            Trainer trainer = tmp.get();
            if (trainer.getName() != t.getName()) {
                trainer.setName(t.getName());
            }
            if (trainer.getSurname() != t.getSurname()) {
                trainer.setSurname(t.getSurname());
            }
            if (trainer.getAddress() != t.getAddress()) {
                trainer.setAddress(t.getAddress());
            }
            if (trainer.getPassword() != t.getPassword()) {
                trainer.setPassword(t.getPassword());
            }
            if (trainer.getSpecializations() != t.getSpecializations()) {
                trainer.setSpecializations(t.getSpecializations());
            }
            trainerRepository.save(trainer);
            return "Updated";
        }
    }
    public Optional<Trainer> singleTrainer(Long id){
        return trainerRepository.findById(id);
    }
}
