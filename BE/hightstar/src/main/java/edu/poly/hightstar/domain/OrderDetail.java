package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "order_details")
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderDetailId;

    private int quantity;
    private double unitPrice;

    
    @ManyToOne(fetch = FetchType.EAGER) // Tham chiếu sẽ được tải ngay lập tức cùng với OrderDetail
    @JoinColumn(name = "orderId", referencedColumnName = "orderId", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER) // Tham chiếu sẽ được tải ngay lập tức cùng với OrderDetail
    @JoinColumn(name = "productId", referencedColumnName = "productId")
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "courseId", referencedColumnName = "courseId")
    private Course course;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ticketId", referencedColumnName = "ticketId")
    private Ticket ticket;

}
