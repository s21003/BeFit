package com.befit.meal;

import com.befit.training.Training;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MealService {
    @Autowired
    private MealRepository mealRepository;
    public List<Meal> allMeals(){
        return  mealRepository.findAll();
    }
    public Meal createMeal(Meal m){
        Meal meal = new Meal();
        meal.setStartTime(m.getStartTime());
        meal.setEndTime(m.getEndTime());
        meal.setUserEmail(m.getUserEmail());
        meal.setLabel(m.getLabel());
        mealRepository.save(meal);
        return meal;
    }
    public String dropMeal(Long id){
        if(mealRepository.findById(id).isEmpty()){
            return "WrongId";
        }
        mealRepository.deleteById(id);
        return "Deleted";
    }
    public String editMeal(Meal m, Long id){
        Optional<Meal> tmp = singleMeal(id);
        if (tmp.isEmpty()){
            return "WrongId";
        }else{
            Meal meal = tmp.get();
            if (meal.getProducts() != m.getProducts()){
                meal.setProducts(m.getProducts());
            }
            mealRepository.save(meal);
            return "Updated";
        }
    }
    public Optional<Meal> singleMeal(Long id){
        return mealRepository.findById(id);
    }

    public List<Meal> userMeal(String email){
        return mealRepository.findByUserEmail(email);
    }

}
