package edu.poly.hightstar.model;

import java.time.LocalDateTime;

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

    @JsonProperty("image")
    private String productImage;

    private String description;

    private double price;

    private double discountedPrice;

    private Integer stock;

    private double discount;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Long categoryId; // Chỉ cần categoryId thay vì đối tượng category

}