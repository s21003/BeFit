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
    private Long trainingId;

    @JoinColumn
    private Long seriesId;

    public TrainingExercise(Long exerciseId, Long trainingId, Long seriesId){
        this.exerciseId=exerciseId;
        this.trainingId=trainingId;
        this.seriesId=seriesId;
    }
}
