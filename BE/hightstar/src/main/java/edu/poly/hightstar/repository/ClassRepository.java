package edu.poly.hightstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.poly.hightstar.domain.ClassEntity;
import edu.poly.hightstar.domain.TimeSlot;

public interface ClassRepository extends JpaRepository<ClassEntity, Long> {

    boolean existsByClassIdAndTrainerTrainerId(Long classId, Long trainerId);

    // Kiểm tra nếu HLV đã có lớp học vào khung giờ này
    boolean existsByTrainerTrainerIdAndClassTimeSlotsTimeSlot(Long trainerId, TimeSlot timeSlot);
}
