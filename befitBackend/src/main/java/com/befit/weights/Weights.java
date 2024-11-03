package com.befit.weights;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table(name ="weights")
@Entity
public class Weights {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column
    private int weight;

    public Weights(int weight){
        this.weight=weight;
    }
}