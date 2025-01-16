package edu.poly.hightstar.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.poly.hightstar.domain.ClassEntity;
import edu.poly.hightstar.domain.ClassStudentEnrollment;
import edu.poly.hightstar.enums.EnrollmentStatus;

public interface ClassStudentEnrollmentRepository extends JpaRepository<ClassStudentEnrollment, Long> {
    List<ClassStudentEnrollment> findByClassEntityClassId(Long classId);

    long countByClassEntityClassId(Long classId);

    void deleteAllByClassEntity(ClassEntity classEntity);

    List<ClassStudentEnrollment> findByStudentStudentIdAndStatus(Long studentId, EnrollmentStatus status);

    List<ClassStudentEnrollment> findByStudentStudentId(Long studentId);

    boolean existsByStudentStudentIdAndClassEntityClassId(Long studentId, Long classId);

    @Query("SELECT c.courseName " +
            "FROM ClassStudentEnrollment cse " +
            "JOIN cse.classEntity ce " +
            "JOIN ce.course c " +
            "WHERE cse.id = :classStudentEnrollmentId")
    String findCourseNameByEnrollmentId(@Param("classStudentEnrollmentId") Long classStudentEnrollmentId);

    Optional<ClassStudentEnrollment> findByClassEntity_ClassIdAndStudent_StudentId(Long classId, Long studentId);

}
