package com.befit.trainer;

import java.util.List;

import com.befit.user.UserTrainer;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table(name = "trainer")
@Entity
public class Trainer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToMany
    private List<UserTrainer> userTrainers;

    @Column
    private String name;

    @Column
    private String surname;

    @Column
    private String address;

    @Column
    private String username;

    @Column
    private String password;

    @ElementCollection
    @CollectionTable
    @Column
    private List<String> specializations;

    public Trainer(String name, String surname, String address, String username, String password, List<String> specializations) {
        this.name = name;
        this.surname = surname;
        this.address = address;
        this.username = username;
        this.password = password;
        this.specializations = specializations;
    }
}
