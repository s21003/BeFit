package com.befit.trainingSchemaExercise;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/trainingSchemaExercise")
public class TrainingSchemaExerciseController {
    @Autowired
    private TrainingSchemaExerciseService trainingSchemaExerciseService;

    @GetMapping("/all")
    public ResponseEntity<List<TrainingSchemaExercise>> getAllTrainingSchemaExercises(){
        return new ResponseEntity<>(trainingSchemaExerciseService.allTrainingSchemaExercise(), HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<TrainingSchemaExercise> addNewTrainingSchemaExercise(@RequestBody TrainingSchemaExercise trainingSchemaExercise){
        TrainingSchemaExercise created = trainingSchemaExerciseService.createTrainingSchemaExercise(trainingSchemaExercise);
        return new ResponseEntity<>(created,HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteTrainingSchemaExercise(@RequestBody TrainingSchemaExercise trainingSchemaExercise){
        return new ResponseEntity<>(trainingSchemaExerciseService.dropTrainingSchemaExercise(trainingSchemaExercise.getId()),HttpStatus.OK);
    }

    @DeleteMapping("/deleteSchema/{id}")
    public ResponseEntity<String> deleteTrainingSchemaExercise(@PathVariable Long id){
        return new ResponseEntity<>(trainingSchemaExerciseService.dropTrainingSchema(id),HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateTrainingSchemaExercise(@RequestBody TrainingSchemaExercise tse, @PathVariable Long id){
        return new ResponseEntity<>(trainingSchemaExerciseService.editTrainingSchemaExercise(tse,id),HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<TrainingSchemaExercise>> getSingleTrainingSchemaExercise(@PathVariable Long id){
        return new ResponseEntity<>(trainingSchemaExerciseService.singleTrainingSchemaExercise(id),HttpStatus.OK);
    }
}
