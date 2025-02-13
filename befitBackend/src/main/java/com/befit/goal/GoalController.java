package com.befit.goal;

import com.befit.meal.Meal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/goal")
public class GoalController {
    @Autowired
    private GoalService goalService;
    @GetMapping("/all")
    public ResponseEntity<List<Goal>> getAllGoals(){
        return new ResponseEntity<>(goalService.allGoals(), HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<Goal> addNewGoal(@RequestBody Goal g){
        return new ResponseEntity<>(goalService.createGoal(g),HttpStatus.CREATED);
    }

    @PostMapping("/user/add")
    public ResponseEntity<Goal> addNewGoal(@RequestBody String userName){
        return new ResponseEntity<>(goalService.createGoalUsername(userName),HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
        public ResponseEntity<String> deleteGoal(@RequestBody Goal g){
            return new ResponseEntity<>(goalService.dropGaol(g.getId()),HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateGoal(@RequestBody Goal g,@PathVariable Long id){
        return new ResponseEntity<>(goalService.editGoal(g,id),HttpStatus.OK);
    }

    @PutMapping("/update/trainer/{id}")
    public ResponseEntity<String> updateGoalAsTrainer(@RequestBody Goal g,@PathVariable Long id){
        return new ResponseEntity<>(goalService.editGoalAsTrainer(g,id),HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Goal>> getSingleExercise(@PathVariable Long id){
        return new ResponseEntity<>(goalService.singleGoal(id),HttpStatus.OK);
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<Goal> getUsersTrainings(@PathVariable String username){
        return new ResponseEntity<>(goalService.userGoal(username),HttpStatus.OK);
    }
}
