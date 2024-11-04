package edu.poly.hightstar.controller.admin;

import edu.poly.hightstar.model.TrainerDTO;
import edu.poly.hightstar.service.TrainerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainers")
public class TrainerController {

    private final TrainerService trainerService;

    public TrainerController(TrainerService trainerService) {
        this.trainerService = trainerService;
    }

    @GetMapping

    public List<TrainerDTO> getAllTrainers() {
        return trainerService.getAllTrainers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainerDTO> getTrainerById(@PathVariable Long id) {
        TrainerDTO trainerDTO = trainerService.getTrainerById(id);

        if (trainerDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(trainerDTO);
    }

    @PostMapping
    public ResponseEntity<?> createTrainer(@RequestBody TrainerDTO trainerDTO) {
        if (trainerService.isPhoneNumberExists(trainerDTO.getPhoneNumber())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Số điện thoại này đã được sử dụng");
        }

        if (trainerService.isEmailExists(trainerDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email này đã được sử dụng");
        }
        TrainerDTO createdTrainer = trainerService.createTrainer(trainerDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdTrainer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrainer(@PathVariable Long id, @RequestBody TrainerDTO trainerDTO) {
        TrainerDTO existingTrainer = trainerService.getTrainerById(id);
        if (existingTrainer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy huấn luyện viên");
        }

        Long userId = existingTrainer.getUserId(); // Lấy userId của Trainer hiện tại

        // Kiểm tra số điện thoại trong UserProfile của các User khác
        if (trainerService.isPhoneNumberExistsForUpdate(trainerDTO.getPhoneNumber(), userId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Số điện thoại này đã được sử dụng");
        }

        // Kiểm tra email trong User của các User khác
        if (trainerService.isEmailExistsForUpdate(trainerDTO.getEmail(), userId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email này đã được sử dụng");
        }

        TrainerDTO updatedTrainer = trainerService.updateTrainer(id, trainerDTO);
        return ResponseEntity.ok(updatedTrainer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTrainer(@PathVariable Long id) {
        trainerService.deleteTrainer(id);
        return ResponseEntity.ok("Trainer deleted successfully.");
    }
}
