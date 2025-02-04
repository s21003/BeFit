package com.befit.trainingSchema;

import com.befit.mealSchema.MealSchema;
import com.befit.training.TrainingCategory;
import com.befit.trainingSchemaExercise.TrainingSchemaExercise;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/trainingSchema")
public class TrainingSchemaController {
    @Autowired
    private TrainingSchemaService trainingSchemaService;
    @GetMapping("/all")
    public ResponseEntity<List<TrainingSchema>> getAllTrainingSchemas(){
        return new ResponseEntity<>(trainingSchemaService.allTrainingSchemas(), HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<TrainingSchema> addNewTrainingSchema(@RequestBody TrainingSchema ts){
        return new ResponseEntity<>(trainingSchemaService.createTrainingSchema(ts),HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteTrainingSchema(@RequestBody TrainingSchema ts){
        return new ResponseEntity<>(trainingSchemaService.dropTrainingSchema(ts.getId()),HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateTrainingSchema(@RequestBody TrainingSchema ts, @PathVariable Long id){
        return new ResponseEntity<>(trainingSchemaService.editTrainingSchema(ts,id),HttpStatus.OK);
    }

    @PutMapping("/updatetse/{id}")
    public ResponseEntity<String> updateTrainingSchemaExercises(@RequestBody List<TrainingSchemaExercise> ids, @PathVariable Long id){
        return new ResponseEntity<>(trainingSchemaService.editTrainingSchemaExercises(ids,id),HttpStatus.OK);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<TrainingCategory>> getCategories(){
        return new ResponseEntity<>(trainingSchemaService.getCategories(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<TrainingSchema>> getSingleExercise(@PathVariable Long id){
        return new ResponseEntity<>(trainingSchemaService.singleTrainingSchema(id),HttpStatus.OK);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<List<TrainingSchema>> getUsersTrainingSchemas(@PathVariable String username){
        return new ResponseEntity<>(trainingSchemaService.getUsersTrainingSchemas(username),HttpStatus.OK);
    }
}
