package com.befit.training;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/training")
public class TrainingController {
    @Autowired
    private TrainingService trainingService;
    @GetMapping("/all")
    public ResponseEntity<List<Training>> getAllTrainings(){
        return new ResponseEntity<>(trainingService.allTrainings(), HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<Training> addNewTraining(@RequestBody Training tr){
        return new ResponseEntity<>(trainingService.createTraining(tr),HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteTraining(@RequestBody Training tr){
        return new ResponseEntity<>(trainingService.dropTraining(tr.getId()),HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateTraining(@RequestBody Training tr, @PathVariable Long id){
        return new ResponseEntity<>(trainingService.editTraining(tr,id),HttpStatus.OK);
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<Training>> getUsersTrainings(@PathVariable String email){
        return new ResponseEntity<>(trainingService.userTrainings(email),HttpStatus.OK);
    }
}
