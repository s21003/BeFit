package com.befit.trainingExercise;

import com.befit.trainingSchemaExercise.TrainingSchemaExercise;
import com.befit.trainingSchemaExercise.TrainingSchemaExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/trainingExercise")
public class TrainingExerciseController {
    @Autowired
    private TrainingExerciseService trainingExerciseService;

    @GetMapping("/all")
    public ResponseEntity<List<TrainingExercise>> getAllTrainingExercises(){
        return new ResponseEntity<>(trainingExerciseService.allTrainingExercies(), HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<TrainingExercise> addNewTrainingExercise(@RequestBody TrainingExercise ts){
        return new ResponseEntity<>(trainingExerciseService.createTrainingExercise(ts),HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteTrainingExercise(@RequestBody TrainingExercise ts){
        return new ResponseEntity<>(trainingExerciseService.dropTrainingExercise(ts.getId()),HttpStatus.OK);
    }
    @DeleteMapping("/deleteSchema/{id}")
    public ResponseEntity<String> deleteTrainingSchemaExercise(@PathVariable Long id){
        return new ResponseEntity<>(trainingExerciseService.dropTraining(id),HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateTrainingExercise(@RequestBody TrainingExercise ts, @PathVariable Long id){
        return new ResponseEntity<>(trainingExerciseService.editTrainingExercise(ts,id),HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<TrainingExercise>> getSingleTrainingExercise(@PathVariable Long id){
        return new ResponseEntity<>(trainingExerciseService.singleTrainingExercise(id),HttpStatus.OK);
    }
}
