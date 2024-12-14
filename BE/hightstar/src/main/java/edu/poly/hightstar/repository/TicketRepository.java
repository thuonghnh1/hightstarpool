package edu.poly.hightstar.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.Ticket;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByTicketCode(String ticketCode);

    // Số lượng vé đã bán trong khoảng thời gian cụ thể dự trên issuDate
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.issueDate BETWEEN :start AND :end")
    long countByIssueDateBetween(LocalDateTime start, LocalDateTime end);

    // Lấy danh sách vé mới nhất theo ngày phát hành
    Page<Ticket> findAllByOrderByIssueDateDesc(Pageable pageable);
}
