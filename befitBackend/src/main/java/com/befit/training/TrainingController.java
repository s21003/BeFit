package com.befit.training;

import com.befit.trainingExercise.TrainingExercise;
import com.befit.trainingSchemaExercise.TrainingSchemaExercise;
import com.befit.user.User;
import com.befit.userTrainer.UserTrainerDTO;
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

    @PutMapping("/updatete/{id}")
    public ResponseEntity<String> updateTrainingExercises(@RequestBody List<TrainingExercise> ids, @PathVariable Long id){
        return new ResponseEntity<>(trainingService.editTrainingExercises(ids,id),HttpStatus.OK);
    }

    @PutMapping("/addTrainer/{id}")
    public ResponseEntity<String> addTrainerToTraining(@RequestBody UserTrainerDTO trainerId, @PathVariable Long id){
        return new ResponseEntity<>(trainingService.addTrainerToTraining(trainerId,id),HttpStatus.OK);
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Training>> getUsersTrainings(@PathVariable String username){
        return new ResponseEntity<>(trainingService.userTrainings(username),HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Training>> getSingleUser(@PathVariable Long id){
        return new ResponseEntity<>(trainingService.singleTrainingById(id),HttpStatus.OK);
    }

}
