package com.befit.userTrainer;

import com.befit.mealSchema.MealSchema;
import com.befit.trainingSchema.TrainingSchema; // Import your TrainingSchema entity
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table(name = "userTrainer")
@Entity
public class UserTrainer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @JoinColumn
    private Long userId;

    @JoinColumn
    private Long trainerId;

    @Enumerated(EnumType.STRING)
    @Column
    private CooperationStatus status;

    @Column
    private LocalDate timestamp;

    @ManyToMany
    @JoinTable(
            name = "user_trainer_meal_schemas",
            joinColumns = @JoinColumn(name = "user_trainer_id"),
            inverseJoinColumns = @JoinColumn(name = "meal_schema_id")
    )
    private List<MealSchema> sharedMealSchemas;

    @ManyToMany
    @JoinTable(
            name = "user_trainer_training_schemas", // New join table for training schemas
            joinColumns = @JoinColumn(name = "user_trainer_id"),
            inverseJoinColumns = @JoinColumn(name = "training_schema_id")
    )
    private List<TrainingSchema> sharedTrainingSchemas; // New field for training schemas
}