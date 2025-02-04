package com.befit.training;

import java.time.LocalDateTime;
import java.util.List;

import com.befit.trainingExercise.TrainingExercise;
import com.befit.trainingSchema.TrainingSchema;
import com.befit.trainingSchemaExercise.TrainingSchemaExercise;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.micrometer.common.lang.Nullable;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table(name = "training")
@Entity
public class Training {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @JoinColumn
    @OneToMany
    private List<TrainingExercise> trainingExerciseIds;

    @Column
    private String userUsername;

    @Column
    private LocalDateTime startTime;

    @Column
    @Nullable
    private LocalDateTime endTime;

    @Column
    @Enumerated(EnumType.STRING)
    private TrainingCategory category;

    @JoinColumn
    @Nullable
    private Long trainerId;

    public Training(String userUsername, LocalDateTime startTime, TrainingCategory category) {
        this.userUsername = userUsername;
        this.startTime = startTime;
        this.category = category;
    }
}

