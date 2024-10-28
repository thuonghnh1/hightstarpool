package edu.poly.hightstar.controller.admin;

import edu.poly.hightstar.service.CourseService;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import edu.poly.hightstar.model.CourseDTO;

@RestController
@RequestMapping("/api/courses")
public class CoursesController {
    private final CourseService courseService;

    public CoursesController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping

    public List<CourseDTO> getAllCourses() {

        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")

        public ResponseEntity<CourseDTO> getCourseById(@PathVariable Long id) {
                CourseDTO courseDTO = courseService.getCourseById(id);
                if (courseDTO == null) {
                        return ResponseEntity.notFound().build(); // 404 Not Found nếu không tìm thấy
                }
                return ResponseEntity.ok(courseDTO); // 200 OK với discountDto
        }
    @PostMapping
        public ResponseEntity<CourseDTO> createCourse(@RequestBody CourseDTO courseDTO) {
                CourseDTO createdCourse  = courseService.createCourse(courseDTO);

                // trả về phản hồi với mã trạng thái(HTTP 201 created), body là phần thân p/hồi
                return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);

        }



        @PutMapping("/{id}")
        public ResponseEntity<CourseDTO> updateDiscount(@PathVariable Long id, @RequestBody CourseDTO courseDTO) {
                CourseDTO updatedCourse = courseService.updateCourse(id, courseDTO);

                return ResponseEntity.ok(updatedCourse);
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<String> deleteDiscount(@PathVariable Long id) {
                courseService.deleteCourse(id);
                return ResponseEntity.ok("course deleted successfully."); // 200 OK với thông điệp
        }
}
