package com.befit.mealProduct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class MealProductService {
    @Autowired
    private MealProductRepository mealProductRepository;
    public List<MealProduct> allMealProducts() { return mealProductRepository.findAll(); }
    public MealProduct createMealProduct(MealProduct ms){
        MealProduct mealProduct = new MealProduct();
        mealProduct.setProductId(ms.getProductId());
        mealProduct.setMealId(ms.getMealId());
        mealProduct.setWeightsId(ms.getWeightsId());
        mealProductRepository.save(mealProduct);
        return mealProduct;
    }
    public String dropMealProduct(Long id){
        if (mealProductRepository.findById(id).isEmpty()){
            return "WrongId";
        }
        mealProductRepository.deleteById(id);
        return "Deleted";
    }
    public String editMealProduct(MealProduct ms, Long id){
        Optional<MealProduct> existingMealProduct = singleMealProduct(id);
        if (existingMealProduct.isEmpty()){
            return "WrongId";
        }else{
            MealProduct updatedMealProduct = existingMealProduct.get();
            updatedMealProduct.setProductId(ms.getProductId());
            updatedMealProduct.setMealId(ms.getMealId());
            updatedMealProduct.setWeightsId(ms.getWeightsId());

            mealProductRepository.save(updatedMealProduct);
            return "Updated";
        }
    }
    public Optional<MealProduct> singleMealProduct(Long id) { return mealProductRepository.findById(id); }

    public String dropMeal(Long id) {
        List<MealProduct> all = mealProductRepository.findAll();
        String flag = "ERROR with delete";
        for (int i = 0; i < all.size(); i++) {
            if (Objects.equals(all.get(i).getMealId(), id)){
                mealProductRepository.deleteById(all.get(i).getId());
                flag = "Deleted";
            } else {
                flag = "Wrong id";
            }
        }
        return flag;
    }
}