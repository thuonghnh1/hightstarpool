package edu.poly.hightstar.controller.admin;

import edu.poly.hightstar.model.StudentDTO;
import edu.poly.hightstar.service.CloudinaryService;
import edu.poly.hightstar.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/employee/students")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService studentService;
    private final CloudinaryService cloudinaryService;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER')")
    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        List<StudentDTO> students = studentService.getAllStudents();
        return students.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(students);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER')")
    @GetMapping("/students-by-user/{userId}")
    public List<StudentDTO> getStudentsByUser(@PathVariable Long userId) {
        List<StudentDTO> students = studentService.getStudentsByUserId(userId);
        return students;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER')")
    @GetMapping("/{id}")
    public StudentDTO getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PostMapping
    public ResponseEntity<StudentDTO> createStudent(
            @RequestPart("student") String studentData,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        String publicId = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            StudentDTO studentDTO = mapper.readValue(studentData, StudentDTO.class);

            if (file != null && !file.isEmpty()) {
                String imageUrl = cloudinaryService.uploadImage(file, "student");
                if (imageUrl != null) {
                    publicId = extractPublicId(imageUrl);
                    studentDTO.setAvatar(imageUrl);
                }
            }

            StudentDTO createdStudent = studentService.createStudent(studentDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdStudent);

        } catch (Exception e) {
            handleImageDeletion(publicId);
            throw new RuntimeException("Lỗi khi tạo học viên: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PutMapping("/{id}")
    public StudentDTO updateStudent(
            @PathVariable Long id,
            @RequestPart("student") String studentData,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            StudentDTO studentDTO = mapper.readValue(studentData, StudentDTO.class);
            StudentDTO existingStudent = studentService.getStudentById(id);

            if (file != null && !file.isEmpty()) {
                handleImageDeletion(extractPublicId(existingStudent.getAvatar()));
                studentDTO.setAvatar(cloudinaryService.uploadImage(file, "student"));
            } else {
                studentDTO.setAvatar(existingStudent.getAvatar());
            }

            return studentService.updateStudent(id, studentDTO);

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi cập nhật học viên: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long id) {
        StudentDTO studentDTO = studentService.getStudentById(id);
        if (studentDTO.getAvatar() != null) {
            handleImageDeletion(extractPublicId(studentDTO.getAvatar()));
        }
        studentService.deleteStudent(id);
        return ResponseEntity.ok("Học viên đã được xóa thành công.");
    }

    private String extractPublicId(String imageUrl) {
        if (imageUrl != null && imageUrl.contains("/") && imageUrl.contains(".")) {
            int start = imageUrl.lastIndexOf("/") + 1;
            int end = imageUrl.lastIndexOf(".");
            return imageUrl.substring(start, end);
        }
        return null;
    }

    private void handleImageDeletion(String publicId) {
        if (publicId != null) {
            try {
                cloudinaryService.deleteImage(publicId);
            } catch (IOException e) {
                System.err.println("Lỗi khi xóa ảnh: " + e.getMessage());
            }
        }
    }
}
