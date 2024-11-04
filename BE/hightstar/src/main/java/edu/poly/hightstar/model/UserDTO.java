package edu.poly.hightstar.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import edu.poly.hightstar.enums.Role;
import edu.poly.hightstar.enums.UserStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    @JsonProperty("id")
    private Long userId;
    private String fullName; // Từ userProfile
    private String phoneNumber; // Từ userProfile
    private String username;
    private String password;
    private String email;
    private Role role;
    private LocalDateTime registeredDate;
    private LocalDateTime lastLogin;
    private UserStatus status;
}
