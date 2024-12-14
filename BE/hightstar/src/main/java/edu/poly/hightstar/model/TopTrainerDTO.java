package edu.poly.hightstar.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopTrainerDTO {
    private String trainerName;
    private String specialty;
    private int experienceYears;
    private String schedule;
    private double rating;
}