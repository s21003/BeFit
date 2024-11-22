package com.befit.mealSchema;

import com.befit.meal.MealLabel;
import com.befit.mealSchemaProduct.MealSchemaProduct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
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
        mealSchema.setName(ms.getName());
        mealSchema.setCreatorEmail(ms.getCreatorEmail());
        mealSchema.setCreationDate(LocalDate.now());
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
            if (mealSchema.getCreatorEmail() != ms.getCreatorEmail()){
                mealSchema.setCreatorEmail(ms.getCreatorEmail());
            }
            if (mealSchema.getCreationDate() != ms.getCreationDate()){
                mealSchema.setCreationDate(ms.getCreationDate());
            }
            mealSchemaRepository.save(mealSchema);
            return "Updated";
        }
    }

    public String editMealSchemaProducts(List<MealSchemaProduct> ids, Long id){
        Optional<MealSchema> tmp = singleMealSchema(id);
        if (tmp.isEmpty()){
            return "WrongId";
        }else{
            MealSchema mealSchema = tmp.get();
            mealSchema.setMealSchemaProductIds(ids);

            mealSchemaRepository.save(mealSchema);
            return "Updated";
        }
    }

    public List<MealLabel> getTypes(){ return Arrays.asList(MealLabel.values()); }

    public Optional<MealSchema> singleMealSchema(Long id){
        return mealSchemaRepository.findById(id);
    }
}
