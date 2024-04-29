package com.befit.goal;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.micrometer.common.lang.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table(name = "goal")
@Entity
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column
    @Nullable
    private double actualWeight;

    @Column
    @Nullable
    private double plannedDailyKcal;

    @Column
    @Nullable
    private double plannedDailyProteins;

    @Column
    @Nullable
    private double plannedDailyFats;

    @Column
    @Nullable
    private double plannedDailyCarbs;

    @Column
    @Nullable
    private double targetWeight;

    @Column
    @Nullable
    private double recommendedDailyKcal;

    @Column
    @Nullable
    private double recommendedDailyProteins;

    @Column
    @Nullable
    private double recommendedDailyFats;

    @Column
    @Nullable
    private double recommendedDailyCarbs;

    @Column
    @JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate plannedAccomplishDate;


    public Goal(double actualWeight, double plannedDailyKcal, double plannedDailyProteins, double plannedDailyFats, double plannedDailyCarbs, LocalDate plannedAccomplishDate) {
        this.actualWeight = actualWeight;
        this.plannedDailyKcal = plannedDailyKcal;
        this.plannedDailyProteins = plannedDailyProteins;
        this.plannedDailyFats = plannedDailyFats;
        this.plannedDailyCarbs = plannedDailyCarbs;
        this.plannedAccomplishDate = plannedAccomplishDate;
    }
}
