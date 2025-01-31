package com.befit.exercise;

import java.net.URL;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.*;
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
@Table(name = "Exercise")
@Entity
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column
    private String name;

    @Column
    @Enumerated(EnumType.STRING)
    private BodyPart part;

    @Column
    @Nullable
    private URL videoLink=null;

    @Column
    private String creatorUsername;

}
