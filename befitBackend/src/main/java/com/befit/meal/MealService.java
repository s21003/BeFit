package com.befit.meal;

import com.befit.mealProduct.MealProduct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
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
        meal.setUserUsername(m.getUserUsername());
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
        Optional<Meal> existingMeal = singleMeal(id);
        if (existingMeal.isEmpty()){
            return "WrongId";
        }else{
            Meal updatedMeal = existingMeal.get(); // Get the existing meal
            updatedMeal.setLabel(m.getLabel());
            updatedMeal.setStartTime(m.getStartTime());
            updatedMeal.setEndTime(m.getEndTime());

            mealRepository.save(updatedMeal);
            return "Updated: " + updatedMeal;
        }
    }

    public String editMealData(MealDataDTO m, Long id) {
        Optional<Meal> existingMeal = singleMeal(id);

        if (existingMeal.isEmpty()) {
            return "WrongId";
        }

        Meal updatedMeal = existingMeal.get();

        try {
            MealLabel label = MealLabel.valueOf(m.getLabel());
            updatedMeal.setLabel(label);
        } catch (IllegalArgumentException e) {
            return "Invalid meal label: " + m.getLabel();
        }
        updatedMeal.setStartTime(m.getStartTime());
        updatedMeal.setEndTime(m.getEndTime());

        mealRepository.save(updatedMeal);
        return "Updated: " + updatedMeal;
    }

    public Optional<Meal> singleMeal(Long id){
        return mealRepository.findById(id);
    }

    public List<Meal> userMeal(String username){
        return mealRepository.findByUserUsername(username);
    }

    public List<MealLabel> getLabels() {
        return Arrays.asList(MealLabel.values());
    }

    public String editMealProducts(List<MealProduct> ids, Long id) {
        Optional<Meal> tmp = singleMeal(id);
        if (tmp.isEmpty()){
            return "WrongId";
        }else{
            Meal meal = tmp.get();
            meal.setMealProductIds(ids);

            mealRepository.save(meal);
            return "Updated";
        }
    }


}
