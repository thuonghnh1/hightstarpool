package edu.poly.hightstar.controller.sites;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import edu.poly.hightstar.model.CourseDTO;
import edu.poly.hightstar.model.TrainerDTO;
import edu.poly.hightstar.service.CourseService;
import edu.poly.hightstar.service.TrainerService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class HomeController {

    private final CourseService courseService;
    private final TrainerService trainerService;

    @GetMapping("/courses")
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        List<CourseDTO> courses = courseService.getAllCourses();
        return courses.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(courses);
    }

    @GetMapping("courses/{id}")
    public CourseDTO getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    @GetMapping("/trainers")
    public ResponseEntity<List<TrainerDTO>> getAllTrainers() {
        List<TrainerDTO> trainers = trainerService.getAllTrainers();
        if (trainers.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 không có bản ghi nào
        }
        return ResponseEntity.ok(trainers); // 200 OK
    }

    @GetMapping("trainers/{id}")
    public TrainerDTO getTrainerById(@PathVariable Long id) {
        return trainerService.getTrainerById(id);
    }

}
