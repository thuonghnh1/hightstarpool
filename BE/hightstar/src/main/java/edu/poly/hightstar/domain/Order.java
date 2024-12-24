package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

import edu.poly.hightstar.enums.OrderStatus;
import edu.poly.hightstar.enums.PaymentMethod;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime orderDate;

    @Column(nullable = false)
    private double total;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;

    @Column(length = 500) // Đặt độ dài tùy ý
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status; // Enum quản lý trạng thái đơn hàng

    @Column(length = 255)
    private String shippingAddress;

    @ManyToOne
    @JoinColumn(name = "discountId", referencedColumnName = "discountId")
    private Discount discount;

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;
}