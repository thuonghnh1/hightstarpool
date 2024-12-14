package edu.poly.hightstar.repository;

import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    // Đếm số lượng học viên đã đăng ký trong khoảng thời gian cụ thể dựa trên
    // registeredDate của User
    @Query("SELECT COUNT(s) FROM Student s WHERE s.user.registeredDate BETWEEN :start AND :end")
    long countByUserRegisteredDateBetween(LocalDateTime start, LocalDateTime end);
}
