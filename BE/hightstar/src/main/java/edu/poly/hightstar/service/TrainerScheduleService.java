package edu.poly.hightstar.service;

import edu.poly.hightstar.domain.TrainerSchedule;

import java.util.List;

public interface TrainerScheduleService {

    // Lấy danh sách lịch dạy còn trống theo danh sách timeSlotId
    List<TrainerSchedule> getAvailableSchedulesByTimeSlots(List<Long> timeSlotIds);

    // Tăng số lượng học viên trong lịch dạy
    TrainerSchedule incrementStudentCount(Long trainerScheduleId, int maxStudents);

    // Thêm hoặc cập nhật lịch dạy mới
    TrainerSchedule saveOrUpdateSchedule(TrainerSchedule trainerSchedule);

    // Lấy danh sách lịch dạy của HLV
    List<TrainerSchedule> getSchedulesByTrainerId(Long trainerId);
}
