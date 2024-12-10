package edu.poly.hightstar.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.Attendance;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    // Lấy các bản điểm danh chưa có checkOut
    List<Attendance> findByCheckOutTimeIsNull();

    // Tìm Attendance cho học viên
    Optional<Attendance> findByStudentStudentIdAndTicketTicketIdAndAttendanceDate(Long studentId, Long ticketId,
            Date attendanceDate);

    // Tìm Attendance cho người bơi bình thường (studentId null)
    Optional<Attendance> findByStudentIsNullAndTicketTicketIdAndAttendanceDate(Long ticketId, Date attendanceDate);
}
