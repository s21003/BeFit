package com.befit.trainer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/trainer")
public class TrainerController {
    @Autowired
    private TrainerService trainerService;
    @GetMapping("/all")
    public ResponseEntity<List<Trainer>> getAllTrainers(){
        return new ResponseEntity<>(trainerService.allTrainers(), HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<Trainer> addNewTrainer(@RequestBody Trainer t){
        return new ResponseEntity<>(trainerService.createTrainer(t),HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteTrainer(@RequestBody Trainer t){
        return new ResponseEntity<>(trainerService.dropTrainer(t.getId()),HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateTrainer(@RequestBody Trainer t, @PathVariable Long id){
        return new ResponseEntity<>(trainerService.editTrainer(t,id),HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Trainer>> getSingleExercise(@PathVariable Long id){
        return new ResponseEntity<>(trainerService.singleTrainer(id),HttpStatus.OK);
    }
}
