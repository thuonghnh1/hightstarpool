package edu.poly.hightstar.model;

import edu.poly.hightstar.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDTO {
    private String fullName;
    private String phoneNumber;
    private String email;
    private String password;
    private Role role; // mặc định là vai trong User
}
