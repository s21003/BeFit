package com.befit.training;

import java.time.LocalDateTime;

import com.befit.trainingSchema.TrainingSchema;
import com.fasterxml.jackson.annotation.JsonFormat;
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
    @ManyToOne
    private TrainingSchema trainingSchema;

    @Column
    private long userId;

    @Column
    @JsonFormat(pattern="yyyy-MM-dd")
    private LocalDateTime date;

    @Column
    @Enumerated(EnumType.STRING)
    private TrainingCategory category;

    public Training(TrainingSchema trainingSchema, long userId, LocalDateTime date, TrainingCategory category) {
        this.trainingSchema = trainingSchema;
        this.userId = userId;
        this.date = date;
        this.category = category;
    }
}

