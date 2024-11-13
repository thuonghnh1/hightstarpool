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

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER')") // cho phép hlv có thể xem được danh sách học sinh.
    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        List<StudentDTO> students = studentService.getAllStudents();
        return students.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(students);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER')")
    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        StudentDTO studentDTO = studentService.getStudentById(id);
        return studentDTO != null
                ? ResponseEntity.ok(studentDTO)
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<StudentDTO> createStudent(
            @RequestPart("student") String studentData,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        String publicId = null;

        try {
            ObjectMapper mapper = new ObjectMapper();
            StudentDTO studentDTO = mapper.readValue(studentData, StudentDTO.class);

            if (file != null && !file.isEmpty()) { // nếu có thêm avt thì tải nó lên đám mây
                String imageUrl = cloudinaryService.uploadImage(file, "student");
                if (imageUrl != null) {
                    publicId = extractPublicId(imageUrl);
                    studentDTO.setAvatar(imageUrl);
                }
            }

            StudentDTO createdStudent = studentService.createStudent(studentDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdStudent);

        } catch (Exception e) {
            e.printStackTrace();
            handleImageDeletion(publicId);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudent(
            @PathVariable Long id,
            @RequestPart("student") String studentData,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            StudentDTO studentDTO = mapper.readValue(studentData, StudentDTO.class);
            StudentDTO existingStudent = studentService.getStudentById(id);

            if (existingStudent == null) {
                return ResponseEntity.notFound().build();
            }

            if (file != null && !file.isEmpty()) {
                handleImageDeletion(extractPublicId(existingStudent.getAvatar()));
                studentDTO.setAvatar(cloudinaryService.uploadImage(file, "student"));
            } else {
                studentDTO.setAvatar(existingStudent.getAvatar());
            }

            StudentDTO updatedStudent = studentService.updateStudent(id, studentDTO);
            return ResponseEntity.ok(updatedStudent);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long id) {
        StudentDTO studentDTO = studentService.getStudentById(id);
        if (studentDTO == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Student không tồn tại hoặc không thể xóa.");
        }
        if (studentDTO.getAvatar() != null) {
            handleImageDeletion(extractPublicId(studentDTO.getAvatar()));
        }
        studentService.deleteStudent(id);
        return ResponseEntity.ok("Student đã được xóa thành công.");
    }

    private String extractPublicId(String imageUrl) {
        if (imageUrl != null && imageUrl.contains("/") && imageUrl.contains(".")) {
            int start = imageUrl.lastIndexOf("/") + 1;
            int end = imageUrl.lastIndexOf(".");
            if (start < end) { // Đảm bảo chỉ số bắt đầu nhỏ hơn chỉ số kết thúc
                return imageUrl.substring(start, end);
            }
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
