package com.befit.trainingExercise;

import com.befit.series.Series;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table(name = "trainingExercise")
@Entity
public class TrainingExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn
    private Long exerciseId;

    @JoinColumn
    private Long trainingSchemaId;

    @JoinColumn
    @ManyToOne
    private Series series;

    public TrainingExercise(Long exerciseId, Long trainingSchemaId, Series series){
        this.exerciseId=exerciseId;
        this.trainingSchemaId=trainingSchemaId;
        this.series=series;
    }
}
