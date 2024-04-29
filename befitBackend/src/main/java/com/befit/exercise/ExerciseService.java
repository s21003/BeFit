package com.befit.exercise;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExerciseService {
    @Autowired
    private ExerciseRepository exerciseRepository;
    public List<Exercise> allExercises(){
        return exerciseRepository.findAll();
    }
    public Exercise createExercise(Exercise ex){
        Exercise exercise = new Exercise();
        if(ex.getVideoLink()==null){
            exercise.setVideoLink(null);
        }else{
            exercise.setVideoLink(ex.getVideoLink());
        }
        if(ex.getSeries()==null){
            exercise.setSeries(null);
        }else{
            exercise.setSeries(ex.getSeries());
        }
        exercise.setName(ex.getName());
        exercise.setPart(ex.getPart());
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
        Optional<Exercise> tmp = singleExercise(id);
        if(tmp.isEmpty()){
            return "WrongId";
        }else{
            Exercise exercise = tmp.get();
            if (exercise.getName() != ex.getName()){
                exercise.setName(ex.getName());
            }
            if (exercise.getPart() != ex.getPart()){
                exercise.setPart(ex.getPart());
            }
            if (exercise.getVideoLink() != ex.getVideoLink()){
                exercise.setVideoLink(ex.getVideoLink());
            }
            if (exercise.getSeries() != ex.getSeries()){
                exercise.setSeries(ex.getSeries());
            }
            exerciseRepository.save(exercise);
            return "Updated";
        }
    }
    public Optional<Exercise> singleExercise(Long id){
        return exerciseRepository.findById(id);
    }
}
