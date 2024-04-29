package com.befit.exercise;

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

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table
@Entity(name = "Series")
public class Series {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column
    private int series;

    @Column
    private int repeatNumber;

    @Column
    @Nullable
    private double weight;

    public Series(int series, int repeatNumber, @Nullable double weight) {
        this.series = series;
        this.repeatNumber = repeatNumber;
        this.weight = weight;
    }
}

