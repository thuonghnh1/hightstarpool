package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

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
    @Column(length = 700)
    private String description;
    @Column(nullable = false)
    private double price;
    @Column(nullable = false)
    private Integer stock;
    @Column(nullable = false)
    private double discount;
    private Date createdAt;
    private Date updatedAt;

    @ManyToOne
    @JoinColumn(name = "categoryId", referencedColumnName = "categoryId")
    private Category category;
}
