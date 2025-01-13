package edu.poly.hightstar.service;

import java.util.List;

import edu.poly.hightstar.model.StudentDTO;

public interface StudentService {
    List<StudentDTO> getAllStudents();

    StudentDTO getStudentById(Long id);

    List<StudentDTO> getStudentsByUserId(Long userId);

    StudentDTO createStudent(StudentDTO studentDTO);

    StudentDTO updateStudent(Long id, StudentDTO studentDTO);

    void deleteStudent(Long id);
}
