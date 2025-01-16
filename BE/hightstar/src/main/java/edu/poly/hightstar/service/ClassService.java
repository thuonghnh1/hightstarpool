package edu.poly.hightstar.service;

import java.time.LocalDate;
import java.util.List;
import edu.poly.hightstar.model.ClassDTO;
import edu.poly.hightstar.model.ClassRequest;
import edu.poly.hightstar.model.StudentEnrollmentDTO;
import edu.poly.hightstar.model.TrainerDTO;

public interface ClassService {

    List<StudentEnrollmentDTO> getEnrolledStudentsByClassId(Long classId);

    List<ClassDTO> getAllClasses();

    ClassDTO getClassById(Long classId);

    List<ClassDTO> getAvailableClassesForCourse(Long courseId);

    List<ClassDTO> getAvailableClassesForCourseAndStudent(Long courseId, Long studentId);

    List<TrainerDTO> getAvailableTrainersForNew(List<Long> selectedTimeSlotIds, LocalDate startDate);

    List<TrainerDTO> getAvailableTrainersForUpdate(List<Long> selectedTimeSlotIds, Long classId,
            LocalDate startDate);

    String getCourseNameByEnrollmentId(Long classStudentEnrollmentId);

    List<ClassDTO> getEnrolledClassesByStudentId(Long studentId);

    ClassDTO createClass(ClassRequest request);

    ClassDTO updateClass(Long classId, ClassRequest request);

    void deleteClassById(Long classId);

}
