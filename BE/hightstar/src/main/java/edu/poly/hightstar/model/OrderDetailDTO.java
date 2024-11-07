package edu.poly.hightstar.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailDTO {
    @JsonProperty("id")
    private Long orderDetailId;
    private String name;
    private String image;
    private int quantity;
    private double unitPrice;
    private Long orderId;
    private Long productId;
    private Long courseId;
    private Long ticketId;
}
