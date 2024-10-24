package edu.poly.hightstar.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    @JsonProperty("id")
    private Long userId;
    private String username;
    private String password;
    private String email;
    private String role;
    private LocalDateTime registeredDate;
    private LocalDateTime lastLogin;
    private boolean status;
}
