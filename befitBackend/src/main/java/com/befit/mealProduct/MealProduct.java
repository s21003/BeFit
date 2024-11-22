package com.befit.mealProduct;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table(name = "MealProduct")
@Entity
public class MealProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @JoinColumn
    private long productId;

    @JoinColumn
    private long mealId;

    @JoinColumn
    private long weightsId;

    public MealProduct(long productId, long mealId, long weightsId){
        this.productId=productId;
        this.mealId=mealId;
        this.weightsId=weightsId;
    }
}