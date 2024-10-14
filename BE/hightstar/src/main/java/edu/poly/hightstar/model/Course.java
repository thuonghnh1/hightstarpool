package edu.poly.hightstar.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courseId;

    private String courseName;
    private Integer maxStudents;
    private String description;
    private Float price;
    private Integer numberOfSessions;
}
