package edu.poly.hightstar.service;

import edu.poly.hightstar.model.TrainerDTO;
import java.util.List;


public interface TrainerService {

    List<TrainerDTO> getAllTrainers(); // Lấy danh sách tất cả HLV

    TrainerDTO getTrainerById(Long id); // Lấy thông tin HLV theo id

    TrainerDTO createTrainer(TrainerDTO trainerDTO); // Tạo HLV mới

    TrainerDTO updateTrainer(Long id, TrainerDTO trainerDTO); // Cập nhật thông tin HLV

    void deleteTrainer(Long id); // Xóa HLV
}
