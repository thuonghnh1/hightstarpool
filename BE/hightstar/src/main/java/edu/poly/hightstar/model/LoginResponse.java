package edu.poly.hightstar.model;

import edu.poly.hightstar.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private Long userId;
    private String fullName;
    private String email;
    private String avatar;
    private Role role;
    private String accessToken;
    private String refreshToken; 
}
