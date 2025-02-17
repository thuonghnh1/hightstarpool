package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;
    @Column(length = 100, nullable = false)
    private String fullName;
    @Column(length = 50)
    private String nickname;
    @Column(length = 50, nullable = false)
    private Integer age;
    private String avatar;
    private Boolean gender;
    @Column(length = 200, nullable = true)
    private String note;

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;
}
