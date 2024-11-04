package edu.poly.hightstar.controller.admin;

import edu.poly.hightstar.model.StudentDTO;
import edu.poly.hightstar.service.StudentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public List<StudentDTO> getAllStudents() {
        System.out.println(studentService.getAllStudents());
        return studentService.getAllStudents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        StudentDTO studentDTO = studentService.getStudentById(id);
        if (studentDTO == null) {
            return ResponseEntity.notFound().build(); // 404 not found
        }
        return ResponseEntity.ok(studentDTO);
    }
     @PostMapping
    public ResponseEntity<StudentDTO> createStudent(@RequestBody StudentDTO studentDTO) {
        StudentDTO createStudent = studentService.createStudent(studentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createStudent);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable Long id, @RequestBody StudentDTO studentDTO) {
        StudentDTO updatedStudent = studentService.updateStudent(id, studentDTO);
        return ResponseEntity.ok(updatedStudent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok("Student deleted successfully.");
    }


}
