package edu.poly.hightstar.domain;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;
    @Column(length = 200)
    private String productName;
    private String productImage;
    @Column(name = "description", length = 2000) // Đặt kích thước tối đa là 2000 ký tự
    private String description;
    @Column(nullable = false)
    private double price;
    @Column(nullable = false)
    private Integer stock;
    @Column(nullable = false)
    private double discount;
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Mối quan hệ Many-to-One với Category
    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "categoryId", nullable = false)
    private Category category;

    // Mối quan hệ One-to-Many với Review
    @OneToMany(mappedBy = "product")
    private List<Review> reviews; // Trường này sẽ lưu trữ danh sách các đánh giá liên quan tới sản phẩm
}
