package com.befit.trainer;

import com.befit.userTrainer.UserTrainer;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TrainerDTO {
    private Long id;
    private List<Specialization> specializations;
    private String description;
}
