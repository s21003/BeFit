package com.befit.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping
public class UserTrainerController {
    @Autowired
    private UserTrainerService userTrainerService;
    @GetMapping
    public ResponseEntity<List<UserTrainer>> getAllUserTrainers(){
        return new ResponseEntity<>(userTrainerService.allUserTrainers(), HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<UserTrainer> addNewUserTrainer(@RequestBody UserTrainer ut){
        return new ResponseEntity<>(userTrainerService.createUserTrainer(ut),HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUserTrainer(@RequestBody UserTrainer ut){
        return new ResponseEntity<>(userTrainerService.dropUserTrainer(ut.getId()),HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateUserTrainer(@RequestBody UserTrainer ut, @PathVariable Long id){
        return new ResponseEntity<>(userTrainerService.editUserTrainer(ut,id),HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<UserTrainer>> getSingleExercise(@PathVariable Long id){
        return new ResponseEntity<>(userTrainerService.singleUserTrainer(id),HttpStatus.OK);
    }
}
