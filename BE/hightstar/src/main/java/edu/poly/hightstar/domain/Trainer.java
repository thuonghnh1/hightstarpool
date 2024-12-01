package edu.poly.hightstar.domain;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "trainers")
public class Trainer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trainerId;

    @Column(length = 60)
    private String specialty;

    @Column(nullable = false, length = 90)
    private Integer experienceYears;

    @Column(nullable = false, length = 100)
    private String schedule;

    @Column(nullable = false)
    private double rating;

    @OneToOne(fetch = FetchType.LAZY) // thông tin User sẽ luôn được lấy cùng lúc khi truy vấn trainer
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;

    // Mối quan hệ One-to-Many với Review
    @OneToMany(mappedBy = "trainer")
    private List<Review> reviews;  // Trường này sẽ lưu trữ danh sách các đánh giá liên quan tới sản phẩm
}
