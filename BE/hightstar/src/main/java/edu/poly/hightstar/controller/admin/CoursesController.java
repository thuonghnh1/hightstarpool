package edu.poly.hightstar.controller.admin;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import edu.poly.hightstar.model.CourseDTO;
import edu.poly.hightstar.service.CloudinaryService;
import edu.poly.hightstar.service.CourseService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/courses")
@RequiredArgsConstructor
public class CoursesController {

    private final CloudinaryService cloudinaryService;
    private final CourseService courseService;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER')")
    @GetMapping
    public List<CourseDTO> getAllCourses() {
        return courseService.getAllCourses();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER')")
    @GetMapping("/{id}")
    public CourseDTO getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
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

    @PreAuthorize("hasAnyRole('ADMIN')")
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

    @PreAuthorize("hasAnyRole('ADMIN')")
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
