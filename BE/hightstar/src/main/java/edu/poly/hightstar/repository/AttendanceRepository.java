package edu.poly.hightstar.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.Attendance;
import edu.poly.hightstar.domain.ClassSession;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
        // Lấy các bản điểm danh chưa có checkOut
        List<Attendance> findByCheckOutTimeIsNull();

        @Query("SELECT a FROM Attendance a WHERE a.ticket.ticketId = :ticketId")
        Optional<Attendance> findByTicketId(Long ticketId);

        // Tìm Attendance cho học viên dựa trên classStudentEnrollmentId, ticketId và
        // ngày điểm danh
        @Query("SELECT a FROM Attendance a WHERE a.ticket.classStudentEnrollment.classStudentEnrollmentId = :classStudentEnrollmentId AND a.ticket.ticketId = :ticketId AND a.attendanceDate = :attendanceDate")
        Optional<Attendance> findByClassStudentEnrollmentIdAndTicketIdAndAttendanceDate(Long classStudentEnrollmentId,
                        Long ticketId, Date attendanceDate);

        // Tìm Attendance cho người bơi bình thường (classStudentEnrollmentId null) dựa
        // trên ticketId và ngày điểm danh
        @Query("SELECT a FROM Attendance a WHERE a.ticket.classStudentEnrollment IS NULL AND a.ticket.ticketId = :ticketId AND a.attendanceDate = :attendanceDate")
        Optional<Attendance> findByClassStudentEnrollmentIsNullAndTicketIdAndAttendanceDate(Long ticketId,
                        Date attendanceDate);

        void deleteAllByClassSessionIn(List<ClassSession> classSessions);

        // Lấy tất cả Attendance của 1 class + 1 student
        @Query("SELECT a FROM Attendance a "
                        + "JOIN a.classSession cs "
                        + "JOIN cs.classEntity c "
                        + "WHERE c.classId = :classId "
                        + "  AND a.ticket.classStudentEnrollment.student.studentId = :studentId")
        List<Attendance> findByClassIdAndStudentId(
                        @Param("classId") Long classId,
                        @Param("studentId") Long studentId);

}
