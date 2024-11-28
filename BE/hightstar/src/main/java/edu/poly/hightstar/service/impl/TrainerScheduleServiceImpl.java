package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.TrainerSchedule;
import edu.poly.hightstar.repository.TrainerScheduleRepository;
import edu.poly.hightstar.service.TrainerScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainerScheduleServiceImpl implements TrainerScheduleService {

    @Autowired
    private TrainerScheduleRepository trainerScheduleRepository;

    @Override
    public List<TrainerSchedule> getAvailableSchedulesByTimeSlots(List<Long> timeSlotIds) {
        return trainerScheduleRepository.findAvailableSchedulesByTimeSlots(timeSlotIds);
    }

    @Override
    public TrainerSchedule incrementStudentCount(Long trainerScheduleId, int maxStudents) {
        TrainerSchedule schedule = trainerScheduleRepository.findById(trainerScheduleId)
                .orElseThrow(
                        () -> new IllegalArgumentException("TrainerSchedule not found with ID: " + trainerScheduleId));

        // Kiểm tra số lượng học viên tối đa
        if (schedule.getStudentCount() + 1 > maxStudents) {
            throw new IllegalArgumentException("Max students exceeded for this schedule!");
        }

        schedule.setStudentCount(schedule.getStudentCount() + 1);

        // Điều chỉnh MaxStudents nếu cần
        if (schedule.getMaxStudents() == null || schedule.getMaxStudents() > maxStudents) {
            schedule.setMaxStudents(maxStudents);
        }

        return trainerScheduleRepository.save(schedule);
    }

    @Override
    public TrainerSchedule saveOrUpdateSchedule(TrainerSchedule trainerSchedule) {
        return trainerScheduleRepository.save(trainerSchedule);
    }

    @Override
    public List<TrainerSchedule> getSchedulesByTrainerId(Long trainerId) {
        return trainerScheduleRepository.findByTrainer_TrainerId(trainerId);
    }
}
