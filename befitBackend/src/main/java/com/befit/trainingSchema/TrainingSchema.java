package com.befit.trainingSchema;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.befit.training.TrainingCategory;
import com.befit.trainingSchemaExercise.TrainingSchemaExercise;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table(name = "TrainingSchema")
@Entity
public class TrainingSchema {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @JoinColumn
    @OneToMany
    private List<TrainingSchemaExercise> trainingSchemaExerciseIds;

    @JoinColumn
    private TrainingCategory category;

    @Column
    private String name;

    @Column
    @JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate creationDate;

    @Column
    private String creatorEmail;

    public TrainingSchema(String name, TrainingCategory category,String creatorEmail) {
        this.category = category;
        this.name=name;
        this.creatorEmail=creatorEmail;
    }
}

