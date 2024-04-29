package com.befit.mealSchema;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MealSchemaService {
    @Autowired
    private MealSchemaRepository mealSchemaRepository;
    public List<MealSchema> allMealSchemas(){
        return mealSchemaRepository.findAll();
    }
    public MealSchema createMealSchema(MealSchema ms){
        MealSchema mealSchema = new MealSchema();
        ms.setCreatorId(ms.getCreatorId());
        ms.setProducts(ms.getProducts());
        ms.setCreationDate(LocalDate.now());
        mealSchemaRepository.save(mealSchema);
        return mealSchema;
    }
    public String dropMealSchema(Long id){
        if(mealSchemaRepository.findById(id).isEmpty()){
            return "WrongId";
        }
        mealSchemaRepository.deleteById(id);
        return "Deleted";
    }
    public String editMealSchema(MealSchema ms, Long id){
        Optional<MealSchema> tmp = singleMealSchema(id);
        if(tmp.isEmpty()){
            return "WrongId";
        }else{
            MealSchema mealSchema = tmp.get();
            if (mealSchema.getCreatorId() != ms.getCreatorId()){
                mealSchema.setCreatorId(ms.getCreatorId());
            }
            if(mealSchema.getProducts() != ms.getProducts()){
                mealSchema.setProducts(ms.getProducts());
            }
            if (mealSchema.getCreationDate() != ms.getCreationDate()){
                mealSchema.setCreationDate(ms.getCreationDate());
            }
            mealSchemaRepository.save(mealSchema);
            return "Updated";
        }
    }
    public Optional<MealSchema> singleMealSchema(Long id){
        return mealSchemaRepository.findById(id);
    }
}
