package edu.poly.hightstar.domain;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    @Column(name = "description", length = 2000) // Đặt kích thước tối đa là 2000 ký tự
    private String description;
    private double price;
    private int numberOfSessions;

    // Mối quan hệ One-to-Many với Review
    @OneToMany(mappedBy = "course")
    private List<Review> reviews; // Trường này sẽ lưu trữ danh sách các đánh giá liên quan tới sản phẩm
}
