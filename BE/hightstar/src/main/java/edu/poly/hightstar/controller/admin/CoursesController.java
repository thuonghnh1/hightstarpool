package edu.poly.hightstar.controller.admin;

import edu.poly.hightstar.service.CloudinaryService;
import edu.poly.hightstar.service.CourseService;
import lombok.RequiredArgsConstructor;
import edu.poly.hightstar.model.CourseDTO;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CoursesController {
        private final CloudinaryService cloudinaryService;
        private final CourseService courseService;

        @GetMapping
        public ResponseEntity<List<CourseDTO>> getAllCourses() {
                List<CourseDTO> courses = courseService.getAllCourses();
                return courses.isEmpty()
                                ? ResponseEntity.noContent().build()
                                : ResponseEntity.ok(courses);
        }

        @GetMapping("/{id}")
        public ResponseEntity<CourseDTO> getCourseById(@PathVariable Long id) {
                CourseDTO courseDTO = courseService.getCourseById(id);
                return courseDTO != null
                                ? ResponseEntity.ok(courseDTO)
                                : ResponseEntity.notFound().build();
        }

        // Spring Boot không tự động phân tích cú pháp JSON trong FormData nếu gửi cả
        // tệp và JSON cùng nhau nên phải tự đọc json sau khi nhận bằng mapper
        @PostMapping
        public ResponseEntity<CourseDTO> createCourse(
                        @RequestPart("course") String courseData,
                        @RequestPart("file") MultipartFile file) {
                String publicId = null;

                System.out.println(file);
                try {
                        // Chuyển chuỗi JSON thành CourseDTO
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
                        e.printStackTrace();
                        handleImageDeletion(publicId);
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
                }
        }

        @PutMapping("/{id}")
        public ResponseEntity<CourseDTO> updateCourse(
                        @PathVariable Long id,
                        @RequestPart("course") String courseData,
                        @RequestPart(value = "file", required = false) MultipartFile file) {
                try {
                        // Chuyển đổi chuỗi JSON thành đối tượng CourseDTO
                        ObjectMapper mapper = new ObjectMapper();
                        CourseDTO courseDTO = mapper.readValue(courseData, CourseDTO.class);
                        CourseDTO existingCourse = courseService.getCourseById(id);
                        if (existingCourse == null) {
                                return ResponseEntity.notFound().build();
                        }

                        if (file != null && !file.isEmpty()) {
                                // xóa ảnh cũ và chọn ảnh mới.
                                handleImageDeletion(extractPublicId(existingCourse.getCourseImage()));
                                courseDTO.setCourseImage(cloudinaryService.uploadImage(file, "course"));
                        } else {
                                // nếu k có file mới thì giữ nguyên ảnh hiện tại
                                courseDTO.setCourseImage(existingCourse.getCourseImage());
                        }

                        CourseDTO updatedCourse = courseService.updateCourse(id, courseDTO);
                        return ResponseEntity.ok(updatedCourse);

                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
                }
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<String> deleteCourse(@PathVariable Long id) {
                CourseDTO courseDTO = courseService.getCourseById(id);
                if (courseDTO == null) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body("Khóa học không tồn tại hoặc không thể xóa.");
                }

                handleImageDeletion(extractPublicId(courseDTO.getCourseImage()));
                courseService.deleteCourse(id);
                return ResponseEntity.ok("Khóa học đã được xóa thành công.");
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
