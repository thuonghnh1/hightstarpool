package edu.poly.hightstar.service;

import edu.poly.hightstar.model.TrainerDto;
import java.util.List;


public interface TrainerService {
    List<TrainerDto> getAllTrainers(); // Lấy danh sách tất cả HLV

    TrainerDto getTrainerById(Long id); // Lấy thông tin HLV theo id

    TrainerDto createTrainer(TrainerDto trainerDto); // Tạo HLV mới

    TrainerDto updateTrainer(Long id, TrainerDto trainerDto); // Cập nhật thông tin HLV

    void deleteTrainer(Long id); // Xóa HLV
}
