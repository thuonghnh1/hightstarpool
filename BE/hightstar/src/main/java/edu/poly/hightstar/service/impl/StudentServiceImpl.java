package edu.poly.hightstar.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.poly.hightstar.domain.Student;
import edu.poly.hightstar.domain.User;
import edu.poly.hightstar.model.StudentDTO;
import edu.poly.hightstar.repository.StudentRepository;
import edu.poly.hightstar.repository.UserRepository;
import edu.poly.hightstar.service.StudentService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream().map(student -> {
            StudentDTO dto = new StudentDTO();
            if (student.getUser() != null) {
                dto.setUserId(student.getUser().getUserId());
            }
            BeanUtils.copyProperties(student, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(
                        () -> new AppException("Không tìm thấy học viên này!", ErrorCode.STUDENT_NOT_FOUND));
        StudentDTO studentDTO = new StudentDTO();
        BeanUtils.copyProperties(student, studentDTO);
        return studentDTO;
    }

    @Override
    @Transactional
    public StudentDTO createStudent(StudentDTO studentDTO) {
        Student student = new Student();
        BeanUtils.copyProperties(studentDTO, student);

        User user = userRepository.findById(studentDTO.getUserId())
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng với ID " + studentDTO.getUserId(),
                        ErrorCode.USER_NOT_FOUND));
        student.setUser(user);

        Student createdStudent = studentRepository.save(student);

        StudentDTO createdStudentDTO = new StudentDTO();
        BeanUtils.copyProperties(createdStudent, createdStudentDTO);
        createdStudentDTO.setUserId(createdStudent.getUser().getUserId());

        return createdStudentDTO;
    }

    @Override
    @Transactional
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy học viên với này", ErrorCode.STUDENT_NOT_FOUND));

        BeanUtils.copyProperties(studentDTO, student);

        User user = userRepository.findById(studentDTO.getUserId())
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng với ID " + studentDTO.getUserId(),
                        ErrorCode.USER_NOT_FOUND));
        student.setUser(user);

        Student updatedStudent = studentRepository.save(student);

        StudentDTO updatedStudentDTO = new StudentDTO();
        BeanUtils.copyProperties(updatedStudent, updatedStudentDTO);
        updatedStudentDTO.setUserId(updatedStudent.getUser().getUserId());

        return updatedStudentDTO;
    }

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new AppException("Không tìm thấy học viên để xóa với ID " + id, ErrorCode.COURSE_NOT_FOUND);
        }
        studentRepository.deleteById(id);
    }
}
