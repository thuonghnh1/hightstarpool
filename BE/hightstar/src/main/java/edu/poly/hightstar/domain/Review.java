package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @Column(length = 5, nullable = false)
    private int rating;
    private String comment;
    private String images;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "productId", nullable = true)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "courseId", nullable = true)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "trainerId", nullable = true)
    private Trainer trainer;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

}
