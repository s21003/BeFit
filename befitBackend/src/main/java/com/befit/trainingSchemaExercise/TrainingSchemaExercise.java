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
@Table(name = "TrainingSchemaExercise")
@Entity
public class TrainingSchemaExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @JoinColumn
    private long exerciseId;

    @JoinColumn
    private long trainingSchemaId;

    @JoinColumn
    private long seriesId;

    public TrainingSchemaExercise(long exerciseId, long trainingSchemaId, long seriesId){
        this.exerciseId=exerciseId;
        this.trainingSchemaId=trainingSchemaId;
        this.seriesId=seriesId;
    }
}
