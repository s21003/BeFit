package com.befit.exercise;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExerciseDTO {
    private String name;
    private String part;
    private String videoLink="";
    private String creatorUsername;
}
