package com.befit.mealSchemaProduct;

import com.befit.mealSchemaProduct.MealSchemaProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/mealSchemaProduct")
public class MealSchemaProductController {
    @Autowired
    private MealSchemaProductService mealSchemaProductService;

    @GetMapping("/all")
    public ResponseEntity<List<MealSchemaProduct>> getAllMealSchemaProducts(){
        return new ResponseEntity<>(mealSchemaProductService.allMealSchemaProducts(), HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<MealSchemaProduct> addNewMealSchemaProduct(@RequestBody MealSchemaProduct mealSchemaProduct){
        MealSchemaProduct created = mealSchemaProductService.createMealSchemaProduct(mealSchemaProduct);
        return new ResponseEntity<>(created,HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteMealSchemaProduct(@RequestBody MealSchemaProduct mealSchemaProduct){
        return new ResponseEntity<>(mealSchemaProductService.dropMealSchemaProduct(mealSchemaProduct.getId()),HttpStatus.OK);
    }

    @DeleteMapping("/deleteSchema/{id}")
    public ResponseEntity<String> deleteMealSchemaProduct(@PathVariable Long id){
        return new ResponseEntity<>(mealSchemaProductService.dropMealSchema(id),HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateMealSchemaProduct(@RequestBody MealSchemaProduct msp, @PathVariable Long id){
        return new ResponseEntity<>(mealSchemaProductService.editMealSchemaProduct(msp,id),HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<MealSchemaProduct>> getSingleMealSchemaProduct(@PathVariable Long id){
        return new ResponseEntity<>(mealSchemaProductService.singleMealSchemaProduct(id),HttpStatus.OK);
    }
}
