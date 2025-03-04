package com.befit.mealSchema;

import com.befit.meal.MealLabel;
import com.befit.mealSchemaProduct.MealSchemaProduct;
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

    @PutMapping("/updatemsp/{id}")
    public ResponseEntity<String> updateMealSchemaProducts(@RequestBody List<MealSchemaProduct> ids, @PathVariable Long id){
        return new ResponseEntity<>(mealSchemaService.editMealSchemaProducts(ids,id),HttpStatus.OK);
    }

    @GetMapping("/types")
    public ResponseEntity<List<MealLabel>> getTypes(){
        return new ResponseEntity<>(mealSchemaService.getTypes(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<MealSchema>> getSingleExercise(@PathVariable Long id){
        return new ResponseEntity<>(mealSchemaService.singleMealSchema(id),HttpStatus.OK);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<List<MealSchema>> getUsersMealSchemas(@PathVariable String username){
        return new ResponseEntity<>(mealSchemaService.getUsersMealSchemas(username),HttpStatus.OK);
    }
}
