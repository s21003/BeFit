package com.befit.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/product")
public class ProductController {
    @Autowired
    private ProductService productService;
    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts(){
        return new ResponseEntity<>(productService.allProducts(), HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<Product> addNewProduct(@RequestBody Product p){
        return new ResponseEntity<>(productService.createProduct(p),HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteProduct(@RequestBody Product p){
        return new ResponseEntity<>(productService.dropProduct(p.getId()),HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
        public ResponseEntity<String> updateProduct(@RequestBody Product p, @PathVariable Long id){
            return new ResponseEntity<>(productService.editProduct(p,id),HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Product>> getSingleExercise(@PathVariable Long id){
        return new ResponseEntity<>(productService.singleProduct(id),HttpStatus.OK);
    }
}
