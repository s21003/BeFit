package com.befit.trainingSchemaExercise;

import com.befit.series.Series;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table(name = "trainingSchemaExercise")
@Entity
public class TrainingSchemaExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JoinColumn
    private Long exerciseId;

    @JoinColumn
    private Long trainingSchemaId;

    @JoinColumn
    private Long seriesId;

    public TrainingSchemaExercise(Long exerciseId, Long trainingSchemaId, Long seriesId){
        this.exerciseId=exerciseId;
        this.trainingSchemaId=trainingSchemaId;
        this.seriesId=seriesId;
    }
}
