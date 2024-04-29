package com.befit.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserTrainerService {
    @Autowired
    private UserTrainerRepository userTrainerRepository;
    public List<UserTrainer> allUserTrainers(){
        return userTrainerRepository.findAll();
    }
    public UserTrainer createUserTrainer(UserTrainer ut){
        UserTrainer userTrainer = new UserTrainer();
        userTrainer.setUser(ut.getUser());
        userTrainer.setUser(ut.getUser());
        userTrainerRepository.save(userTrainer);
        return userTrainer;
    }
    public String dropUserTrainer(Long id){
        if(userTrainerRepository.findById(id).isEmpty()){
            return "WrongId";
        }
        userTrainerRepository.deleteById(id);
        return "Deleted";
    }
    public String editUserTrainer(UserTrainer ut, Long id){
        Optional<UserTrainer> tmp = singleUserTrainer(id);
        if (tmp.isEmpty()){
            return "WrongId";
        }else{
            UserTrainer userTrainer = tmp.get();
            if (userTrainer.getTrainer() != ut.getTrainer()){
                userTrainer.setTrainer(ut.getTrainer());
            }
            if (userTrainer.getUser() != ut.getUser()){
                userTrainer.setUser(ut.getUser());
            }
            userTrainerRepository.save(userTrainer);
            return "Updated";
        }
    }
    public Optional<UserTrainer> singleUserTrainer(Long id){
        return userTrainerRepository.findById(id);
    }
}
