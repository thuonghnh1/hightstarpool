package edu.poly.hightstar.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Data
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    private String fullName;
    private String nickname;
    private Integer age;
    private String gender;

    @OneToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;
}
