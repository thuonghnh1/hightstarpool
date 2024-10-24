package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courseId;
    @Column(nullable = false, length = 200)
    private String courseName;
    private String courseImage;
    @Column(nullable = false, length = 4)
    private int maxStudents;
    private String description;
    private double price;
    private int numberOfSessions;
}
