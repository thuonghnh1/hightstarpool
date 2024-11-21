package edu.poly.hightstar.controller.admin;

import edu.poly.hightstar.model.TrainerDTO;
import edu.poly.hightstar.service.TrainerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerService trainerService;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER')")
    @GetMapping
    public ResponseEntity<List<TrainerDTO>> getAllTrainers() {
        List<TrainerDTO> trainers = trainerService.getAllTrainers();
        if (trainers.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 không có bản ghi nào
        }
        return ResponseEntity.ok(trainers); // 200 OK
    }
    

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER')")
    @GetMapping("/{id}")
    public TrainerDTO getTrainerById(@PathVariable Long id) {
        return trainerService.getTrainerById(id);
    }

    @PostMapping
    public TrainerDTO createTrainer(@RequestBody TrainerDTO trainerDTO) {
        return trainerService.createTrainer(trainerDTO);
    }

    @PutMapping("/{id}")
    public TrainerDTO updateTrainer(@PathVariable Long id, @RequestBody TrainerDTO trainerDTO) {
        return trainerService.updateTrainer(id, trainerDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTrainer(@PathVariable Long id) {
        trainerService.deleteTrainer(id);
        return ResponseEntity.ok("Xóa HLV Thành công!");
    }
}
