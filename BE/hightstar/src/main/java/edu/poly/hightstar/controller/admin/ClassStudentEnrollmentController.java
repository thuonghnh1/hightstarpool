package edu.poly.hightstar.controller.admin;

import edu.poly.hightstar.model.ClassDTO;
import edu.poly.hightstar.model.ClassStudentEnrollmentDTO;
import edu.poly.hightstar.model.StudentDTO;
import edu.poly.hightstar.service.ClassStudentEnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee/enrollments")
@RequiredArgsConstructor
public class ClassStudentEnrollmentController {
    private final ClassStudentEnrollmentService enrollmentService;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @GetMapping
    public ResponseEntity<List<ClassStudentEnrollmentDTO>> getAllEnrollments() {
        List<ClassStudentEnrollmentDTO> enrollments = enrollmentService.getAllEnrollments();
        return ResponseEntity.ok(enrollments);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @GetMapping("/{id}")
    public ResponseEntity<ClassStudentEnrollmentDTO> getEnrollmentById(@PathVariable Long id) {
        ClassStudentEnrollmentDTO enrollment = enrollmentService.getEnrollmentById(id);
        return ResponseEntity.ok(enrollment);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @GetMapping("/available-classes")
    public ResponseEntity<List<ClassDTO>> getAvailableClassesForStudent(
            @RequestParam(value = "enrollmentId", required = false) Long enrollmentId) {
        List<ClassDTO> availableClasses = enrollmentService.getAvailableClassesForStudent(enrollmentId);
        return ResponseEntity.ok(availableClasses);
    }

    @GetMapping("/students/not-enrolled")
    public ResponseEntity<List<StudentDTO>> getStudentsNotEnrolledInAnyClass() {
        List<StudentDTO> students = enrollmentService.getStudentsNotEnrolledInAnyClass();
        return ResponseEntity.ok(students);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PostMapping
    public ResponseEntity<ClassStudentEnrollmentDTO> createEnrollment(@RequestBody ClassStudentEnrollmentDTO dto) {
        ClassStudentEnrollmentDTO created = enrollmentService.createEnrollment(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PutMapping("/{id}")
    public ResponseEntity<ClassStudentEnrollmentDTO> updateEnrollment(@PathVariable Long id,
            @RequestBody ClassStudentEnrollmentDTO dto) {
        ClassStudentEnrollmentDTO updated = enrollmentService.updateEnrollment(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
        return ResponseEntity.noContent().build();
    }
}
