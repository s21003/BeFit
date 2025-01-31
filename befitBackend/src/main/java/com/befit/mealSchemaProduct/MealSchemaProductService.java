package com.befit.mealSchemaProduct;

import com.befit.mealSchemaProduct.MealSchemaProduct;
import com.befit.mealSchemaProduct.MealSchemaProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class MealSchemaProductService {
    @Autowired
    private MealSchemaProductRepository mealSchemaProductRepository;
    public List<MealSchemaProduct> allMealSchemaProducts() { return mealSchemaProductRepository.findAll(); }
    public MealSchemaProduct createMealSchemaProduct(MealSchemaProduct msp){
        MealSchemaProduct mealSchemaProduct = new MealSchemaProduct();
        mealSchemaProduct.setProductId(msp.getProductId());
        mealSchemaProduct.setMealSchemaId(msp.getMealSchemaId());
        mealSchemaProduct.setWeightsId(msp.getWeightsId());
        mealSchemaProductRepository.save(mealSchemaProduct);
        return mealSchemaProduct;
    }
    public String dropMealSchemaProduct(Long id){
        if (mealSchemaProductRepository.findById(id).isEmpty()){
            return "WrongId";
        }
        mealSchemaProductRepository.deleteById(id);
        return "Deleted";
    }
    public String editMealSchemaProduct(MealSchemaProduct msp, Long id){
        Optional<MealSchemaProduct> existingmsp = singleMealSchemaProduct(id);
        if (existingmsp.isEmpty()){
            return "WrongId";
        }else{
            MealSchemaProduct updatedmsp = existingmsp.get();
            updatedmsp.setMealSchemaId(msp.getMealSchemaId());
            updatedmsp.setProductId(msp.getProductId());
            updatedmsp.setWeightsId(msp.getWeightsId());

            mealSchemaProductRepository.save(updatedmsp);
            return "Updated";
        }
    }
    public Optional<MealSchemaProduct> singleMealSchemaProduct(Long id) { return mealSchemaProductRepository.findById(id); }

    public String dropMealSchema(Long id) {
        List<MealSchemaProduct> all = mealSchemaProductRepository.findAll();
        String flag = "ERROR with delete";
        for (int i = 0; i < all.size(); i++) {
            if (Objects.equals(all.get(i).getMealSchemaId(), id)){
                mealSchemaProductRepository.deleteById(all.get(i).getId());
                flag = "Deleted";
            } else {
                flag = "Wrong id";
            }
        }
        return flag;
    }

    public List<MealSchemaProduct> getMealSchemaProductsForMealSchemaId(Long mealSchemaId) {
        return mealSchemaProductRepository.findByMealSchemaId(mealSchemaId);
    }
}