package edu.poly.hightstar.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "trainers")
public class Trainer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trainerId;

    private String specialty;
    private Integer experienceYears;
    private String schedule;
    private Float rating;

    @OneToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;
}
