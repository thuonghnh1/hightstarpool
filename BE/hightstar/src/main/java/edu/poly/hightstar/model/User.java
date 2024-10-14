package edu.poly.hightstar.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Data
@Entity
@Table(name = "users")
public class User {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long userId;

@Column(nullable = false, unique = true)
private String username;

@Column(nullable = false)
private String password;

@Column(nullable = false, unique = true)
private String email;

@Column(nullable = false)
private String role;

private Date registeredDate;
private Date lastLogin;
private Boolean status;
}
