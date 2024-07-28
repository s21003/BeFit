package com.befit.training;

import java.time.LocalDateTime;

import com.befit.trainingSchema.TrainingSchema;
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
    @ManyToOne
    private TrainingSchema trainingSchema;

    @Column
    private
    String userEmail;

    @Column
    private LocalDateTime startTime;

    @Column
    @Nullable
    private LocalDateTime endTime;

    @Column
    @Enumerated(EnumType.STRING)
    private TrainingCategory category;





    public Training(String userEmail, LocalDateTime startTime, TrainingCategory category) {
        this.userEmail = userEmail;
        this.startTime = startTime;
        this.category = category;
    }
}

