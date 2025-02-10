package com.befit.series;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table(name ="series")
@Entity
public class Series {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column
    private int series;

    @Column
    private int repeatNumber;

    @Column
    private int weight;
}
