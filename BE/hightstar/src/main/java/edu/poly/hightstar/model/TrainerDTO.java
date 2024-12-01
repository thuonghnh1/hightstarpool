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
    private String fullName;
    private String phoneNumber;
    private String email; // Từ bảng User
    private boolean gender;
    private String avatar;
    private String specialty;
    private int experienceYears;
    private double rating;
    private String schedule;
    private Long userId; // Từ bảng User
    private UserStatus status; // ACTIVE, DISABLED
}
