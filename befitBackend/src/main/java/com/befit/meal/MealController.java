package com.befit.meal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/meal")
public class MealController {
    @Autowired
    private MealService mealService;
    @GetMapping("/all")
    public ResponseEntity<List<Meal>> getAllMeals(){
        return new ResponseEntity<>(mealService.allMeals(), HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<Meal> addNewMeal(@RequestBody Meal m){
        return new ResponseEntity<>(mealService.createMeal(m),HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteMeal(@RequestBody Meal m){
        return new ResponseEntity<>(mealService.dropMeal(m.getId()),HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateMeal(@RequestBody Meal m, @PathVariable Long id){
        return new ResponseEntity<>(mealService.editMeal(m,id),HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Meal>> getSingleExercise(@PathVariable Long id){
        return new ResponseEntity<>(mealService.singleMeal(id),HttpStatus.OK);
    }
}
