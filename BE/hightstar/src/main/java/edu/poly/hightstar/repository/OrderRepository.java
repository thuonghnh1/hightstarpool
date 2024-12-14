package edu.poly.hightstar.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Lấy danh sách đơn hàng mới nhất theo ngày đặt
    Page<Order> findAllByOrderByOrderDateDesc(Pageable pageable);

    // JPQL để lấy tổng doanh thu nhóm theo năm cho các đơn hàng đã hoàn thành
    @Query("SELECT YEAR(o.orderDate), SUM(o.total) FROM Order o WHERE o.status = 'COMPLETED' GROUP BY YEAR(o.orderDate) ORDER BY YEAR(o.orderDate) ASC")
    List<Object[]> findTotalRevenueGroupedByYear();
}
