package edu.poly.hightstar.model;

import java.time.LocalDateTime;
import java.util.List;


import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    @JsonProperty("id") // ID sản phẩm
    private Long productId;
    
    private String productName;

    private String productImage;

    private String description;

    private double price;

    private Integer stock;

    private double discount;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Long categoryId; // Chỉ cần categoryId thay vì đối tượng category

    private List<Long> reviewIds; // Danh sách ID của các đánh giá
}