package com.befit.training;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TrainingDTO {
    private String userUsername;
    private String startTime;
    private String endTime;
    private String category;
}
