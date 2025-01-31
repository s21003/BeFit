package com.befit.userTrainer;

import jakarta.persistence.*;
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
@Table(name = "userTrainer")
@Entity
public class UserTrainer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @JoinColumn
    private Long userId;

    @JoinColumn
    private Long trainerId;

    @Enumerated(EnumType.STRING)
    @Column
    private CooperationStatus status;

    @Column
    private LocalDate timestamp;
}
