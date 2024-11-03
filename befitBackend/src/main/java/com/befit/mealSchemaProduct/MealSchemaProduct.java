package com.befit.mealSchemaProduct;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table(name = "MealSchemaProduct")
@Entity
public class MealSchemaProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @JoinColumn
    private long productId;

    @JoinColumn
    private long mealSchemaId;

    @JoinColumn
    private long weightsId;

    public MealSchemaProduct(long productId, long mealSchemaId, long weightsId){
        this.productId=productId;
        this.mealSchemaId=mealSchemaId;
        this.weightsId=weightsId;
    }
}