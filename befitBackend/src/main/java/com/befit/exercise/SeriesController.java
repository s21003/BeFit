package com.befit.exercise;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/series")
public class SeriesController {
    @Autowired
    private SeriesService seriesService;
    @GetMapping("/all")
    public ResponseEntity<List<Series>> getAllSeries(){
        return new ResponseEntity<>(seriesService.allSeries(), HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<Series> addNewSeries(@RequestBody Series s){
        return new ResponseEntity<>(seriesService.createSeries(s),HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteSeries(@RequestBody Series s){
        return new ResponseEntity<>(seriesService.dropSeries(s.getId()),HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateSeries(@RequestBody Series s, @PathVariable Long id){
        return new ResponseEntity<>(seriesService.editSeries(s,id),HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Series>> getSingleExercise(@PathVariable Long id){
        return new ResponseEntity<>(seriesService.singleSeries(id),HttpStatus.OK);
    }
}
