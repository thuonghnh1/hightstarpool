package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "trainers")
public class Trainer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trainerId;

    @Column(length = 30)
    private String specialty;

    @Column(nullable = false, length = 90)
    private Integer experienceYears;

    @Column(nullable = false, length = 100)
    private String schedule;

    @Column(nullable = false, length = 300)
    private double rating;

    @OneToOne(fetch = FetchType.LAZY) // thông tin User sẽ luôn được lấy cùng lúc khi truy vấn trainer
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;
}
