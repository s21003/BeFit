package com.befit.userTrainer;

import com.befit.trainer.Trainer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/userTrainer")
public class UserTrainerController {
    @Autowired
    private UserTrainerService userTrainerService;
    @GetMapping("/all")
    public ResponseEntity<List<UserTrainer>> getAllUserTrainers(){
        return new ResponseEntity<>(userTrainerService.allUserTrainers(), HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<UserTrainer> addNewUserTrainer(@RequestBody UserTrainer ut){
        return new ResponseEntity<>(userTrainerService.createUserTrainer(ut),HttpStatus.CREATED);
    }

    @PostMapping("/request")
    public ResponseEntity<UserTrainer> addNewRequest(@RequestBody RequestDTO requestDTO){
        return new ResponseEntity<>(userTrainerService.newRequest(requestDTO.getUserId(), requestDTO.getTrainerId()), HttpStatus.CREATED);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUserTrainer(@RequestBody UserTrainer ut){
        return new ResponseEntity<>(userTrainerService.dropUserTrainer(ut.getId()),HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateUserTrainer(@RequestBody UserTrainer ut, @PathVariable Long id){
        return new ResponseEntity<>(userTrainerService.editUserTrainer(ut,id),HttpStatus.OK);
    }

    @PutMapping("/updateRequest/{id}")
    public ResponseEntity<String> updateUserTrainer(@PathVariable Long id, @RequestBody RequestStatusDTO status){
        return new ResponseEntity<>(userTrainerService.updateRequestStatus(id,status),HttpStatus.OK);
    }

    @GetMapping("/acceptedStudents/{trainerId}")
    public ResponseEntity<List<UserTrainer>> getAcceptedStudents(@PathVariable Long trainerId) {
        List<UserTrainer> acceptedStudents = userTrainerService.getAcceptedRequests(trainerId);
        return ResponseEntity.ok(acceptedStudents);
    }

    @GetMapping("/acceptedTrainers/{userId}")
    public ResponseEntity<List<UserTrainer>> getAcceptedTrainers(@PathVariable Long userId) {
        List<UserTrainer> acceptedStudents = userTrainerService.getAcceptedTrainers(userId);
        return ResponseEntity.ok(acceptedStudents);
    }

    @GetMapping("/studentsTrainers/{userId}")
    public ResponseEntity<List<UserTrainer>> getStudentsTrainers(@PathVariable Long userId) {
        return new ResponseEntity<>(userTrainerService.getStudentsTrainers(userId),HttpStatus.OK);
    }

    @GetMapping("/trainerRequests/{trainerId}")
    public ResponseEntity<List<UserTrainer>> getTrainerRequests(@PathVariable Long trainerId) {
        return new ResponseEntity<>(userTrainerService.getTrainerRequests(trainerId),HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Optional<UserTrainer>> getSingleUserTrainerByUserId(@PathVariable Long userId, @RequestParam Long trainerId) {
        return new ResponseEntity<>(userTrainerService.singleUserTrainerByUserId(trainerId, userId), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<UserTrainer>> getSingleUserTrainer(@PathVariable Long id){
        return new ResponseEntity<>(userTrainerService.singleUserTrainer(id),HttpStatus.OK);
    }

    @DeleteMapping("/deleteStudent/{studentId}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long studentId, @RequestBody UserTrainerDTO trainer){
        return new ResponseEntity<>(userTrainerService.deleteStudent(studentId,trainer),HttpStatus.OK);
    }

    @DeleteMapping("/deleteTrainer/{trainerId}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long trainerId, @RequestBody UserStudentDTO student){
        return new ResponseEntity<>(userTrainerService.deleteTrainer(trainerId,student),HttpStatus.OK);
    }
}
