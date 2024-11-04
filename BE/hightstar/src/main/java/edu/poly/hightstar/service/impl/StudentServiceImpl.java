package edu.poly.hightstar.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import edu.poly.hightstar.domain.Student;
import edu.poly.hightstar.domain.User;
import edu.poly.hightstar.model.StudentDTO;
import edu.poly.hightstar.repository.StudentRepository;
import edu.poly.hightstar.repository.UserRepository;
import edu.poly.hightstar.service.StudentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @Override
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream().map(student -> {
            StudentDTO dto = new StudentDTO();

            // Kiểm tra null trước khi gọi getUserId()
            if (student.getUser() != null) {
                dto.setUserId(student.getUser().getUserId());
            }

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
        BeanUtils.copyProperties(studentDTO, student);

        Optional<User> user = userRepository.findById(studentDTO.getUserId());
        if (user.isPresent()) {
            student.setUser(user.get());
        }

        Student createdStudent = studentRepository.save(student);

        StudentDTO createdStudentDTO = new StudentDTO();
        BeanUtils.copyProperties(createdStudent, createdStudentDTO);
        if (createdStudent.getUser() != null) {
            createdStudentDTO.setUserId(createdStudent.getUser().getUserId());
        }

        return createdStudentDTO;
    }

    @Override
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        Optional<Student> studentOptional = studentRepository.findById(id);
        if (studentOptional.isEmpty()) {
            throw new EntityNotFoundException("Không tìm thấy học viên này");
        }

        Student studentDetails = studentOptional.get();
        BeanUtils.copyProperties(studentDTO, studentDetails);

        Optional<User> user = userRepository.findById(studentDTO.getUserId());
        if (user.isPresent()) {
            studentDetails.setUser(user.get());
        }

        Student updatedStudent = studentRepository.save(studentDetails);

        StudentDTO updatedStudentDTO = new StudentDTO();
        BeanUtils.copyProperties(updatedStudent, updatedStudentDTO);
        if (updatedStudent.getUser() != null) {
            updatedStudentDTO.setUserId(updatedStudent.getUser().getUserId());
        }

        return updatedStudentDTO;
    }

    @Override
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

}