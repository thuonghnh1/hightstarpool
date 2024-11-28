package edu.poly.hightstar.repository;

import edu.poly.hightstar.domain.TrainerSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainerScheduleRepository extends JpaRepository<TrainerSchedule, Long> {

    // Lấy danh sách lịch dạy còn trống theo danh sách timeSlotId
    @Query("SELECT ts FROM TrainerSchedule ts WHERE ts.timeSlot.slotId IN :timeSlotIds AND ts.studentCount < ts.maxStudents")
    List<TrainerSchedule> findAvailableSchedulesByTimeSlots(List<Long> timeSlotIds);

    // Lấy danh sách lịch dạy của một huấn luyện viên
    List<TrainerSchedule> findByTrainer_TrainerId(Long trainerId);

    // Lấy lịch dạy theo slot và trainer
    TrainerSchedule findByTrainer_TrainerIdAndTimeSlot_SlotId(Long trainerId, Long slotId);
}
