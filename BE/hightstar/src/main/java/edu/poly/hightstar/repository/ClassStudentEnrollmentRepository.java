package edu.poly.hightstar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.poly.hightstar.domain.ClassEntity;
import edu.poly.hightstar.domain.ClassStudentEnrollment;
import edu.poly.hightstar.enums.EnrollmentStatus;

public interface ClassStudentEnrollmentRepository extends JpaRepository<ClassStudentEnrollment, Long> {
    List<ClassStudentEnrollment> findByClassEntityClassId(Long classId);

    long countByClassEntityClassId(Long classId);

    void deleteAllByClassEntity(ClassEntity classEntity);

    boolean existsByStudentStudentIdAndStatus(Long studentId, EnrollmentStatus status);

}
