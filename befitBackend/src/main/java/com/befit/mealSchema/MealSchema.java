package com.befit.mealSchema;

import java.time.LocalDate;
import java.util.List;

import com.befit.mealSchemaProduct.MealSchemaProduct;
import com.befit.product.Product;
import com.befit.trainingSchemaExercise.TrainingSchemaExercise;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table (name ="MealSchema")
@Entity
public class MealSchema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @JoinColumn
    @OneToMany
    private List<MealSchemaProduct> mealSchemaProductIds;

    @Column
    private String name;

    @Column
    @JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate creationDate;

    @Column
    private String creatorUsername;

    public MealSchema(String name, String creatorUsername) {
        this.name = name;
        this.creatorUsername = creatorUsername;
    }
}
