package com.befit.exercise;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.Optional;

@Service
public class ExerciseService {
    @Autowired
    private ExerciseRepository exerciseRepository;
    public List<Exercise> allExercises(){
        return exerciseRepository.findAll();
    }
    public Exercise createExercise(ExerciseDTO ex){
        Exercise exercise = new Exercise();
        exercise.setName(ex.getName());
        exercise.setPart(BodyPart.valueOf(ex.getPart()));
        exercise.setCreatorUsername(ex.getCreatorUsername());
        if (ex.getVideoLink()!= null &&!ex.getVideoLink().isEmpty()) {
            try {
                URL videoLinkURL = new URL(ex.getVideoLink());
                exercise.setVideoLink(videoLinkURL);
            } catch (MalformedURLException e) {
                System.err.println("Invalid video link URL: " + ex.getVideoLink());
                exercise.setVideoLink(null);
            }
        } else {
            exercise.setVideoLink(null);
        }

        exerciseRepository.save(exercise);
        return exercise;
    }
    public String dropExercise(Long id){
        if(exerciseRepository.findById(id).isEmpty()){
            return "WrongId";
        }
        exerciseRepository.deleteById(id);
        return "Deleted";
    }
    public String editExercise(Exercise ex, Long id){
        Optional<Exercise> existingExercise = singleExercise(id);
        if(existingExercise.isEmpty()){
            return "WrongId";
        }else{
            Exercise updatedExercise = existingExercise.get();
            updatedExercise.setName(ex.getName());
            updatedExercise.setPart(ex.getPart());
            updatedExercise.setVideoLink(ex.getVideoLink());

            exerciseRepository.save(updatedExercise);
            return "Updated";
        }
    }
    public Optional<Exercise> singleExercise(Long id){
        return exerciseRepository.findById(id);
    }

    public List<Exercise> ownExercises(String username) {
        return exerciseRepository.findByCreatorUsername(username);
    }
}
