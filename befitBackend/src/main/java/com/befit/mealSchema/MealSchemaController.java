package com.befit.mealSchema;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/mealSchema")
public class MealSchemaController {
    @Autowired
    private MealSchemaService mealSchemaService;
    @GetMapping("/all")
    public ResponseEntity<List<MealSchema>> getAllMealSchemas(){
        return new ResponseEntity<>(mealSchemaService.allMealSchemas(), HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<MealSchema> addNewMealSchema(@RequestBody MealSchema ms){
        return new ResponseEntity<>(mealSchemaService.createMealSchema(ms),HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteMealSchema(@RequestBody MealSchema ms){
        return new ResponseEntity<>(mealSchemaService.dropMealSchema(ms.getId()),HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateMealSchema(@RequestBody MealSchema ms, @PathVariable Long id){
        return new ResponseEntity<>(mealSchemaService.editMealSchema(ms,id),HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<MealSchema>> getSingleExercise(@PathVariable Long id){
        return new ResponseEntity<>(mealSchemaService.singleMealSchema(id),HttpStatus.OK);
    }
}
