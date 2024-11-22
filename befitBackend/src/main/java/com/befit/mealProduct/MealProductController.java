package com.befit.mealProduct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/mealProduct")
public class MealProductController {
    @Autowired
    private MealProductService mealProductService;

    @GetMapping("/all")
    public ResponseEntity<List<MealProduct>> getAllMealProduct(){
        return new ResponseEntity<>(mealProductService.allMealProducts(), HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<MealProduct> addNewMealProduct(@RequestBody MealProduct mealProduct){
        MealProduct created = mealProductService.createMealProduct(mealProduct);
        return new ResponseEntity<>(created,HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteMealProduct(@RequestBody MealProduct mealProduct){
        return new ResponseEntity<>(mealProductService.dropMealProduct(mealProduct.getId()),HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMealProduct(@PathVariable Long id){
        return new ResponseEntity<>(mealProductService.dropMeal(id),HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateMealProduct(@RequestBody MealProduct ms, @PathVariable Long id){
        return new ResponseEntity<>(mealProductService.editMealProduct(ms,id),HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<MealProduct>> getSingleMealProduct(@PathVariable Long id){
        return new ResponseEntity<>(mealProductService.singleMealProduct(id),HttpStatus.OK);
    }
}
