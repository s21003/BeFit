package com.befit.series;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
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
    public ResponseEntity<Series> addNewSeries(@RequestBody Series series){
        Series created = seriesService.createSeries(series);
        return new ResponseEntity<>(created,HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteSeries(@RequestBody Series series){
        return new ResponseEntity<>(seriesService.dropSeries(series.getId()),HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateSeries(@RequestBody Series series, @PathVariable Long id){
        return new ResponseEntity<>(seriesService.editSeries(series,id),HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Series>> getSingleSeries(@PathVariable Long id){
        return new ResponseEntity<>(seriesService.singleSeries(id),HttpStatus.OK);
    }

}
