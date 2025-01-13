package edu.poly.hightstar.controller.admin;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import edu.poly.hightstar.model.ClassDTO;
import edu.poly.hightstar.model.ClassRequest;
import edu.poly.hightstar.model.TrainerDTO;
import edu.poly.hightstar.service.ClassService;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/employee/classes")
@RequiredArgsConstructor
public class ClassController {
    private final ClassService classService;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PostMapping
    public ResponseEntity<ClassDTO> createClass(@RequestBody ClassRequest request) {
        System.out.println("clc ----------------" + request);

        ClassDTO createdClass = classService.createClass(request);
        System.out.println("clc1 ----------------" + request);

        return new ResponseEntity<>(createdClass, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PutMapping("/{classId}")
    public ResponseEntity<ClassDTO> updateClass(
            @PathVariable Long classId,
            @RequestBody ClassRequest request) {
        ClassDTO updatedClass = classService.updateClass(classId, request);
        return new ResponseEntity<>(updatedClass, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @GetMapping
    public ResponseEntity<List<ClassDTO>> getAllClasses() {
        List<ClassDTO> classes = classService.getAllClasses();
        return new ResponseEntity<>(classes, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @GetMapping("/available-classes-for-course")
    public ResponseEntity<List<ClassDTO>> getAvailableClassesForCourse(@RequestParam Long courseId,
            @RequestParam(required = false) Long studentId) {
        if (studentId != null) {
            List<ClassDTO> classes = classService.getAvailableClassesForCourseAndStudent(courseId, studentId);
            return new ResponseEntity<>(classes, HttpStatus.OK);

        }
        List<ClassDTO> classes = classService.getAvailableClassesForCourse(courseId);
        return new ResponseEntity<>(classes, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @GetMapping("/{classId}")
    public ResponseEntity<ClassDTO> getClassById(@PathVariable Long classId) {
        ClassDTO classDTO = classService.getClassById(classId);
        return new ResponseEntity<>(classDTO, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PostMapping("/available-trainers")
    public ResponseEntity<List<TrainerDTO>> getAvailableTrainers(
            @RequestBody List<Long> selectedTimeSlotIds,
            @RequestParam(required = false) Long classId,
            @RequestParam LocalDate startDate) {
        List<TrainerDTO> availableTrainers;

        if (classId == null) {
            // Đối với thêm mới!
            availableTrainers = classService.getAvailableTrainersForNew(selectedTimeSlotIds, startDate);
        } else {
            // Đối với cập nhật!
            availableTrainers = classService.getAvailableTrainersForUpdate(selectedTimeSlotIds, classId, startDate);
        }

        return ResponseEntity.ok(availableTrainers);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @DeleteMapping("/{classId}")
    public ResponseEntity<Void> deleteClassById(@PathVariable Long classId) {
        classService.deleteClassById(classId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Trả về 204 nếu xóa thành công
    }

}
