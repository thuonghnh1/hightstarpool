package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.repository.CourseRepository;
import edu.poly.hightstar.service.CourseService;
import edu.poly.hightstar.domain.Course;
import edu.poly.hightstar.model.CourseDTO;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {
    private final CourseRepository courseRepository;

    @Override
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream().map(course -> {
            CourseDTO dto = new CourseDTO();
            BeanUtils.copyProperties(course, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy khóa học này!", ErrorCode.COURSE_NOT_FOUND));
        CourseDTO courseDTO = new CourseDTO();
        BeanUtils.copyProperties(course, courseDTO);
        return courseDTO;
    }

    @Override
    public CourseDTO createCourse(CourseDTO courseDTO) {
        Course course = new Course();
        BeanUtils.copyProperties(courseDTO, course);
        Course createdCourse = courseRepository.save(course);

        CourseDTO createdCourseDTO = new CourseDTO();
        BeanUtils.copyProperties(createdCourse, createdCourseDTO);
        return createdCourseDTO;
    }

    @Override
    public CourseDTO updateCourse(Long id, CourseDTO courseDTO) {
        Course course = courseRepository.findById(id)
                .orElseThrow(
                        () -> new AppException("Không tìm thấy khóa học với ID " + id, ErrorCode.COURSE_NOT_FOUND));

        BeanUtils.copyProperties(courseDTO, course);
        Course updatedCourse = courseRepository.save(course);

        CourseDTO updatedCourseDTO = new CourseDTO();
        BeanUtils.copyProperties(updatedCourse, updatedCourseDTO);
        return updatedCourseDTO;
    }

    @Override
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new AppException("Không tìm thấy khóa học này", ErrorCode.COURSE_NOT_FOUND);
        }
        courseRepository.deleteById(id);
    }
}
