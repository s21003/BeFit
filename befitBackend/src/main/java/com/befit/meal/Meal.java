package com.befit.meal;

import java.time.LocalDateTime;
import java.util.List;

import com.befit.mealSchema.MealSchema;
import com.befit.product.Product;
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
@Table(name = "meal")
@Entity
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @JoinColumn
    @OneToMany
    private List<Product> products;

    @JoinColumn
    @OneToMany
    private List<MealSchema> mealSchemas;

    @Column
    private LocalDateTime startTime;

    @Column
    private LocalDateTime endTime;

    @Column
    private String name;

    @Column
    private String userUsername;

    @Column
    @Enumerated(EnumType.STRING)
    private MealLabel label;

}
