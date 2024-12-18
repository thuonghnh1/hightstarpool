package edu.poly.hightstar.service;

import java.util.List;
import edu.poly.hightstar.model.ClassDTO;
import edu.poly.hightstar.model.ClassRequest;
import edu.poly.hightstar.model.StudentEnrollmentDTO;
import edu.poly.hightstar.model.TrainerDTO;

public interface ClassService {

    List<StudentEnrollmentDTO> getEnrolledStudentsByClassId(Long classId);

    List<ClassDTO> getAllClasses();

    ClassDTO getClassById(Long classId);

    List<TrainerDTO> getAvailableTrainers(List<Long> selectedTimeSlotIds);

    List<TrainerDTO> getAvailableTrainers(List<Long> selectedTimeSlotIds, Long classId);

    ClassDTO createClass(ClassRequest request);

    ClassDTO updateClass(Long classId, ClassRequest request);

    void deleteClassById(Long classId);

}
