package edu.poly.hightstar.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.ClassStudentEnrollment;
import edu.poly.hightstar.domain.Ticket;
import jakarta.transaction.Transactional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByTicketCode(String ticketCode);

    // Số lượng vé đã bán trong khoảng thời gian cụ thể dự trên issuDate
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.issueDate BETWEEN :start AND :end")
    long countByIssueDateBetween(LocalDateTime start, LocalDateTime end);

    // Lấy danh sách vé mới nhất theo ngày phát hành
    Page<Ticket> findAllByOrderByIssueDateDesc(Pageable pageable);

    List<Ticket> findByClassStudentEnrollment(ClassStudentEnrollment enrollment);

    @Modifying
    @Transactional
    @Query("DELETE FROM Ticket t WHERE t.classStudentEnrollment.classStudentEnrollmentId = :enrollmentId")
    void deleteByClassStudentEnrollmentId(@Param("enrollmentId") Long enrollmentId);
}
