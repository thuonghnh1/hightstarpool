package edu.poly.hightstar.controller.admin;

import edu.poly.hightstar.service.CloudinaryService;
import edu.poly.hightstar.service.CourseService;
import edu.poly.hightstar.model.CourseDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/courses")
@RequiredArgsConstructor
public class CoursesController {
        private final CloudinaryService cloudinaryService;
        private final CourseService courseService;

        @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER')")
        @GetMapping
        public ResponseEntity<List<CourseDTO>> getAllCourses() {
                List<CourseDTO> courses = courseService.getAllCourses();
                return courses.isEmpty()
                                ? ResponseEntity.noContent().build()
                                : ResponseEntity.ok(courses);
        }

        @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER')")
        @GetMapping("/{id}")
        public CourseDTO getCourseById(@PathVariable Long id) {
                return courseService.getCourseById(id);
        }

        @PostMapping
        public ResponseEntity<CourseDTO> createCourse(
                        @RequestPart("course") String courseData,
                        @RequestPart("file") MultipartFile file) {
                String publicId = null;
                try {
                        ObjectMapper mapper = new ObjectMapper();
                        CourseDTO courseDTO = mapper.readValue(courseData, CourseDTO.class);

                        String imageUrl = cloudinaryService.uploadImage(file, "course");
                        if (imageUrl != null) {
                                publicId = extractPublicId(imageUrl);
                                courseDTO.setCourseImage(imageUrl);
                        }

                        CourseDTO createdCourse = courseService.createCourse(courseDTO);
                        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);

                } catch (Exception e) {
                        handleImageDeletion(publicId);
                        throw new RuntimeException("Lỗi khi tạo khóa học: " + e.getMessage());
                }
        }

        @PutMapping("/{id}")
        public CourseDTO updateCourse(
                        @PathVariable Long id,
                        @RequestPart("course") String courseData,
                        @RequestPart(value = "file", required = false) MultipartFile file) {
                try {
                        ObjectMapper mapper = new ObjectMapper();
                        CourseDTO courseDTO = mapper.readValue(courseData, CourseDTO.class);
                        CourseDTO existingCourse = courseService.getCourseById(id);

                        if (file != null && !file.isEmpty()) {
                                handleImageDeletion(extractPublicId(existingCourse.getCourseImage()));
                                courseDTO.setCourseImage(cloudinaryService.uploadImage(file, "course"));
                        } else {
                                courseDTO.setCourseImage(existingCourse.getCourseImage());
                        }

                        return courseService.updateCourse(id, courseDTO);

                } catch (Exception e) {
                        throw new RuntimeException("Lỗi khi cập nhật khóa học: " + e.getMessage());
                }
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<String> deleteCourse(@PathVariable Long id) {
                CourseDTO courseDTO = courseService.getCourseById(id);
                handleImageDeletion(extractPublicId(courseDTO.getCourseImage()));
                courseService.deleteCourse(id);
                return ResponseEntity.ok("Khóa học đã được xóa thành công!");
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
