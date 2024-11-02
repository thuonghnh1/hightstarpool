package edu.poly.hightstar.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import edu.poly.hightstar.domain.Student;
import edu.poly.hightstar.model.StudentDTO;
import edu.poly.hightstar.repository.StudentRepository;
import edu.poly.hightstar.service.StudentService;

@Service
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream().map(student -> {
            StudentDTO dto = new StudentDTO();
            BeanUtils.copyProperties(student, dto); // Chuyển từ entity sang DTO
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public StudentDTO getStudentById(Long id) {
        Optional<Student> student = studentRepository.findById(id);
        if (student.isPresent()) {
            StudentDTO studentDTO = new StudentDTO();
            BeanUtils.copyProperties(student.get(), studentDTO);
            return studentDTO;
        }
        return null;
    }

    @Override
    public StudentDTO createStudent(StudentDTO studentDTO) {
        Student student = new Student();
        BeanUtils.copyProperties(studentDTO, student); // Chuyển từ DTO sang entity
        Student createdStudent = studentRepository.save(student);

        StudentDTO createdStudentDTO = new StudentDTO();
        BeanUtils.copyProperties(createdStudent, createdStudentDTO); // Trả về DTO sau khi tạo
        return createdStudentDTO;
    }

    @Override
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        Optional<Student> studentOptional = studentRepository.findById(id);
        if (studentOptional.isPresent()) {
            Student studentDetails = studentOptional.get();
            BeanUtils.copyProperties(studentDTO, studentDetails);
            Student updatedStudent = studentRepository.save(studentDetails);

            StudentDTO updatedStudentDTO = new StudentDTO();
            BeanUtils.copyProperties(updatedStudent, updatedStudentDTO);
            return updatedStudentDTO;
        }
        return null; // Hoặc xử lý lỗi nếu không tìm thấy
    }

    @Override
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

}