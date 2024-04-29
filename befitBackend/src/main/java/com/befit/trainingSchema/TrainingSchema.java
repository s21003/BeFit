package com.befit.trainingSchema;

import java.time.LocalDate;
import java.util.List;

import com.befit.exercise.Exercise;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table(name = "trainingSchema")
@Entity
public class TrainingSchema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @JoinColumn
    @OneToMany
    private List<Exercise> exercises;

    @Column
    @JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate creationDate;

    @Column
    private Long creatorId;

    public TrainingSchema(List<Exercise> exercises, LocalDate creationDate, Long creatorId) {
        this.exercises = exercises;
        this.creationDate = creationDate;
        this.creatorId = creatorId;
    }
}

