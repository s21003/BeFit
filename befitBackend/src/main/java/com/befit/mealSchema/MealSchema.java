package com.befit.mealSchema;

import java.time.LocalDate;
import java.util.List;

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
@Table (name ="mealSchema")
@Entity
public class MealSchema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column
    @OneToMany
    private List<Product> products;

    @Column
    @JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate creationDate;

    @Column
    private long creatorId;

    public MealSchema(List<Product> products, LocalDate creationDate, long creatorId) {
        this.products = products;
        this.creationDate = creationDate;
        this.creatorId = creatorId;
    }
}
