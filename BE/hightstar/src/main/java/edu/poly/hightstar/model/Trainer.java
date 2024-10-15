package edu.poly.hightstar.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "trainers")
public class Trainer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Tên biến được rút gọn theo chuẩn

    private String specialty;

    @Column(nullable = false)
    private Integer experienceYears;

    @Column(nullable = false)
    private String schedule;

    @Column(nullable = false)
    private Float rating;

    @OneToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;
}
