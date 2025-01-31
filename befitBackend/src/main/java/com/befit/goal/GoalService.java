package com.befit.goal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GoalService {
    @Autowired
    private GoalRepository goalRepository;
    public List<Goal> allGoals(){
        return goalRepository.findAll();
    }
    public Goal createGoal(Goal g){
        Goal goal = new Goal();
        goal.setActualWeight(g.getActualWeight());
        goal.setPlannedDailyKcal(g.getPlannedDailyKcal());
        goal.setPlannedDailyProteins(g.getPlannedDailyProteins());
        goal.setPlannedDailyFats(g.getPlannedDailyFats());
        goal.setPlannedDailyCarbs(g.getPlannedDailyCarbs());
        goal.setPlannedAccomplishDate(g.getPlannedAccomplishDate());
        goal.setRecommendedDailyKcal(g.getRecommendedDailyKcal());
        goal.setRecommendedDailyProteins(g.getRecommendedDailyProteins());
        goal.setRecommendedDailyFats(g.getRecommendedDailyFats());
        goal.setRecommendedDailyCarbs(g.getRecommendedDailyCarbs());
        goal.setTargetWeight(g.getTargetWeight());
        goalRepository.save(goal);
        return goal;
    }
    public String dropGaol(Long id){
        if(goalRepository.findById(id).isEmpty()){
            return "WrongId";
        }
        goalRepository.deleteById(id);
        return "Deleted";
    }
    public String editGoal(Goal g, Long id){
        Optional<Goal> existingGoal = singleGoal(id);
        if (existingGoal.isEmpty()){
            return "WrongID";
        }else{
            Goal updatedGoal = existingGoal.get();
            updatedGoal.setActualWeight(g.getActualWeight());
            updatedGoal.setPlannedDailyKcal(g.getPlannedDailyKcal());
            updatedGoal.setPlannedDailyProteins(g.getPlannedDailyProteins());
            updatedGoal.setPlannedDailyFats(g.getPlannedDailyFats());
            updatedGoal.setPlannedDailyCarbs(g.getPlannedDailyCarbs());
            updatedGoal.setPlannedAccomplishDate(g.getPlannedAccomplishDate());
            updatedGoal.setTargetWeight(g.getTargetWeight());

            goalRepository.save(updatedGoal);
            return "Updated";
        }
    }
    public Optional<Goal> singleGoal(Long id){
        return goalRepository.findById(id);
    }

    public Goal userGoal(String username) {
        return goalRepository.findByUserUsername(username);
    }

    public Goal createGoalUsername(String userName) {
        Goal goal = new Goal();
        goal.setUserUsername(userName);
        goalRepository.save(goal);
        return goal;
    }

    public String editGoalAsTrainer(Goal g, Long id){
        Optional<Goal> existingGoal = singleGoal(id);
        if (existingGoal.isEmpty()){
            return "WrongID";
        }else{
            Goal updatedGoal = existingGoal.get();
            updatedGoal.setRecommendedDailyKcal(g.getRecommendedDailyKcal());
            updatedGoal.setRecommendedDailyProteins(g.getRecommendedDailyProteins());
            updatedGoal.setRecommendedDailyFats(g.getRecommendedDailyFats());
            updatedGoal.setRecommendedDailyCarbs(g.getRecommendedDailyCarbs());

            goalRepository.save(updatedGoal);
            System.out.println("g: "+g);
            System.out.println("existing: "+existingGoal);
            System.out.println("updatedGoal: "+updatedGoal);
            return "Updated: "+updatedGoal;
        }
    }
}
