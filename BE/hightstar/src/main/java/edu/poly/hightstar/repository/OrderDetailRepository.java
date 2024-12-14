package edu.poly.hightstar.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.OrderDetail;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findByOrderOrderId(Long orderId);

    boolean existsByTicketTicketId(Long ticketId);

    // Số lượng sản phẩm đã bán trong khoảng thời gian cụ thể dựa trên orderDate
    // (lấy các đơn hàng có product không null)
    @Query("SELECT COUNT(od) FROM OrderDetail od WHERE od.order.orderDate BETWEEN :start AND :end AND od.product IS NOT NULL")
    long countProductsSoldByOrderDateBetween(LocalDateTime start, LocalDateTime end);
}
