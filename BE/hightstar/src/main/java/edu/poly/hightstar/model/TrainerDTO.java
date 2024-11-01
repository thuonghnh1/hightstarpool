package edu.poly.hightstar.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import edu.poly.hightstar.enums.UserStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainerDTO {

    @JsonProperty("id")
    private Long trainerId;
    private String fullName; // Từ userProfile
    private String phoneNumber; // Từ userProfile
    private String email; // Từ bảng User
    private boolean gender; // Từ userProfile
    private String specialty;
    private int experienceYears;
    private double rating;
    private String schedule;
    private Long userId; // Từ bảng User
    private UserStatus status; // ACTIVE, DISABLED
}
