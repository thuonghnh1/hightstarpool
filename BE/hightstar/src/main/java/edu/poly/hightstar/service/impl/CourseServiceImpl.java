package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.repository.CourseRepository;
import edu.poly.hightstar.service.CourseService;
import edu.poly.hightstar.domain.Course;
import edu.poly.hightstar.model.CourseDTO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {
    private final CourseRepository courseRepository;

    public CourseServiceImpl(CourseRepository courseRepository){
        this.courseRepository = courseRepository;
    }

    @Override
    public List<CourseDTO> getAllCourses(){
        return courseRepository.findAll().stream().map(course -> {
            CourseDTO dto = new CourseDTO();
            BeanUtils.copyProperties(course, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public CourseDTO getCourseById(Long id) {
       Optional<Course> course = courseRepository.findById(id);
       if (course.isPresent()){
        CourseDTO courseDTO = new CourseDTO();
       BeanUtils.copyProperties(course.get(), courseDTO);
       return courseDTO;
       }
       return null;
    }
    

    @Override
    public CourseDTO createCourse(CourseDTO courseDTO){
        Course course = new Course();
        BeanUtils.copyProperties(courseDTO, course); //chuyển tử dto sang entity
        Course createCourse = courseRepository.save(course);

        CourseDTO createCourseDTO = new CourseDTO();
        BeanUtils.copyProperties(createCourse, createCourseDTO); //trả về dto sau khi tạo
        return createCourseDTO;
    }
    
    @Override
    public CourseDTO updateCourse(Long id, CourseDTO courseDTO){
        Optional<Course> courseOptional = courseRepository.findById(id);
        if (courseOptional.isPresent()){
            Course courseDetails = courseOptional.get();
            BeanUtils.copyProperties(courseDTO, courseDetails);
            Course updatCourse = courseRepository.save(courseDetails);

            CourseDTO updateCourseDTO = new CourseDTO();
            BeanUtils.copyProperties(updatCourse, updateCourseDTO);
            return updateCourseDTO;
        }
        return null; //Hoặc xử lí lỗi nếu ko đc tìm thấy
    }
    @Override 
    public void deleteCourse (Long id){
        courseRepository.deleteById(id);
    }
}
