package com.befit.meal;


import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class MealDataDTO {
    private Long id;
    private String label;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
