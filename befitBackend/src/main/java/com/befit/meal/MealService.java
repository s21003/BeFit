package com.befit.meal;

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
        meal.setProducts(m.getProducts());
        meal.setMealSchemas(m.getMealSchemas());
        meal.setIdUser(m.getIdUser());
        meal.setDate(m.getDate());
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
            if (meal.getIdUser() != m.getIdUser()){
                meal.setIdUser(m.getIdUser());
            }
            if (meal.getDate() != m.getDate()){
                meal.setDate(m.getDate());
            }
            mealRepository.save(meal);
            return "Updated";
        }
    }
    public Optional<Meal> singleMeal(Long id){
        return mealRepository.findById(id);
    }
}
