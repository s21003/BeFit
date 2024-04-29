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
        Optional<Goal> tmp = singleGoal(id);
        if (tmp.isEmpty()){
            return "WrongID";
        }else{
            Goal goal = tmp.get();
            if (goal.getActualWeight() != g.getActualWeight()){
                goal.setActualWeight(g.getActualWeight());
            }
            if (goal.getPlannedDailyKcal() != g.getPlannedDailyKcal()){
                goal.setPlannedDailyKcal(g.getPlannedDailyKcal());
            }
            if (goal.getPlannedDailyProteins() != g.getPlannedDailyProteins()){
                goal.setPlannedDailyProteins(g.getPlannedDailyProteins());
            }
            if (goal.getPlannedDailyFats() != g.getPlannedDailyFats()){
                goal.setPlannedDailyFats(g.getPlannedDailyFats());
            }
            if (goal.getPlannedDailyCarbs() != g.getPlannedDailyCarbs()){
                goal.setPlannedDailyCarbs(g.getPlannedDailyCarbs());
            }
            if (goal.getPlannedAccomplishDate() != g.getPlannedAccomplishDate()){
                goal.setPlannedAccomplishDate(g.getPlannedAccomplishDate());
            }
            if (goal.getRecommendedDailyKcal() != g.getRecommendedDailyKcal()){
                goal.setRecommendedDailyKcal(g.getRecommendedDailyKcal());
            }
            if (goal.getRecommendedDailyProteins() != g.getRecommendedDailyProteins()){
                goal.setRecommendedDailyProteins(g.getRecommendedDailyProteins());
            }
            if (goal.getRecommendedDailyFats() != g.getRecommendedDailyFats()){
                goal.setRecommendedDailyFats(g.getRecommendedDailyFats());
            }
            if (goal.getRecommendedDailyCarbs() != g.getRecommendedDailyCarbs()){
                goal.setRecommendedDailyCarbs(g.getRecommendedDailyCarbs());
            }
            if (goal.getTargetWeight() != g.getTargetWeight()){
                goal.setTargetWeight(g.getTargetWeight());
            }
            goalRepository.save(goal);
            return "Updated";
        }
    }
    public Optional<Goal> singleGoal(Long id){
        return goalRepository.findById(id);
    }
}
