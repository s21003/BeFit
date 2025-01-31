package com.befit.exercise;

import com.befit.product.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/exercise")
public class ExerciseController {
    @Autowired
    private ExerciseService exerciseService;
    @GetMapping("/all")
    public ResponseEntity<List<Exercise>> getAllExercises(){
        return new ResponseEntity<>(exerciseService.allExercises(),HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<Exercise> addNewExercise(@RequestBody ExerciseDTO ex){
        return new ResponseEntity<>(exerciseService.createExercise(ex),HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteExercise(@RequestBody Exercise ex){
        return new ResponseEntity<>(exerciseService.dropExercise(ex.getId()),HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateExercise(@RequestBody Exercise ex, @PathVariable Long id){
        return new ResponseEntity<>(exerciseService.editExercise(ex,id),HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Exercise>> getSingleExercise(@PathVariable Long id){
        return new ResponseEntity<>(exerciseService.singleExercise(id),HttpStatus.OK);
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Exercise>> getOwnExercises(@PathVariable String username){
        return new ResponseEntity<>(exerciseService.ownExercises(username),HttpStatus.OK);
    }
}
