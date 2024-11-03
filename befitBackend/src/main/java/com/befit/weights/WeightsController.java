package com.befit.weights;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/weights")
public class WeightsController {
    @Autowired
    private WeightsService weightsService;
    @GetMapping("/all")
    public ResponseEntity<List<Weights>> getAllWeights(){
        return new ResponseEntity<>(weightsService.allWeights(), HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<Weights> addNewWeights(@RequestBody Weights weights){
        Weights created = weightsService.createWeights(weights);
        return new ResponseEntity<>(created,HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteWeights(@RequestBody Weights weights){
        return new ResponseEntity<>(weightsService.dropWeights(weights.getId()),HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateWeights(@RequestBody Weights weights, @PathVariable Long id){
        return new ResponseEntity<>(weightsService.editWeights(weights,id),HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Weights>> getSingleWeights(@PathVariable Long id){
        return new ResponseEntity<>(weightsService.singleWeights(id),HttpStatus.OK);
    }

}
