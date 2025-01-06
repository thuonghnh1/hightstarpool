package edu.poly.hightstar.service;

import java.util.List;

import edu.poly.hightstar.model.ClassDTO;
import edu.poly.hightstar.model.ClassStudentEnrollmentDTO;
import edu.poly.hightstar.model.StudentDTO;

public interface ClassStudentEnrollmentService {
    List<ClassStudentEnrollmentDTO> getAllEnrollments();

    ClassStudentEnrollmentDTO getEnrollmentById(Long id);

    ClassStudentEnrollmentDTO createEnrollment(ClassStudentEnrollmentDTO dto);

    ClassStudentEnrollmentDTO updateEnrollment(Long id, ClassStudentEnrollmentDTO dto);

    void deleteEnrollment(Long id);

    List<ClassDTO> getAvailableClassesForStudent(Long studentId, Long enrollmentId);

    List<StudentDTO> getStudentsNotEnrolledInAnyClass();
}
