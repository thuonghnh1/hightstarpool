package edu.poly.hightstar.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import edu.poly.hightstar.enums.OrderStatus;
import edu.poly.hightstar.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    @JsonProperty("id")
    private Long orderId;
    private LocalDateTime orderDate;
    private double total;
    private PaymentMethod paymentMethod;
    private String notes;
    private OrderStatus status;
    private String shippingAddress;
    private Long discountId;
    private Long userId;
}
