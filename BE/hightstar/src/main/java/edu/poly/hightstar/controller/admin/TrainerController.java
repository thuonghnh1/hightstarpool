package edu.poly.hightstar.controller.admin;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import edu.poly.hightstar.model.TrainerDTO;
import edu.poly.hightstar.service.CloudinaryService;
import edu.poly.hightstar.service.TrainerService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerService trainerService;
    private final CloudinaryService cloudinaryService;

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
    public ResponseEntity<TrainerDTO> createTrainer(
            @RequestPart("trainer") String trainerData,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        String publicId = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            TrainerDTO trainerDTO = mapper.readValue(trainerData, TrainerDTO.class);

            // Xử lý hình ảnh nếu có
            if (file != null && !file.isEmpty()) {
                String imageUrl = cloudinaryService.uploadImage(file, "trainer");
                if (imageUrl != null) {
                    publicId = extractPublicId(imageUrl);
                    trainerDTO.setAvatar(imageUrl);
                }
            }

            TrainerDTO createdTrainer = trainerService.createTrainer(trainerDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTrainer);

        } catch (Exception e) {
            e.printStackTrace();
            handleImageDeletion(publicId);
            throw new RuntimeException("Lỗi khi tạo huấn luyện viên: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public TrainerDTO updateTrainer(
            @PathVariable Long id,
            @RequestPart("trainer") String trainerData,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            TrainerDTO trainerDTO = mapper.readValue(trainerData, TrainerDTO.class);
            TrainerDTO existingTrainer = trainerService.getTrainerById(id);

            // Xử lý hình ảnh nếu có, xóa hình ảnh cũ nếu có
            if (file != null && !file.isEmpty()) {
                handleImageDeletion(extractPublicId(existingTrainer.getAvatar()));
                trainerDTO.setAvatar(cloudinaryService.uploadImage(file, "trainer"));
            } else {
                trainerDTO.setAvatar(existingTrainer.getAvatar());
            }

            return trainerService.updateTrainer(id, trainerDTO);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi cập nhật huấn luyện viên: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTrainer(@PathVariable Long id) {
        trainerService.deleteTrainer(id);
        return ResponseEntity.ok("Xóa HLV Thành công!");
    }

    // Phương thức phụ để lấy Public ID từ URL
    private String extractPublicId(String imageUrl) {
        if (imageUrl != null && imageUrl.contains("/") && imageUrl.contains(".")) {
            int start = imageUrl.lastIndexOf("/") + 1;
            int end = imageUrl.lastIndexOf(".");
            return imageUrl.substring(start, end);
        }
        return null;
    }

    // Xóa ảnh khi gặp lỗi hoặc khi cập nhật
    private void handleImageDeletion(String publicId) {
        if (publicId != null) {
            try {
                cloudinaryService.deleteImage(publicId);
            } catch (IOException e) {
                System.err.println("Lỗi khi xóa ảnh: " + e.getMessage());
            }
        }
    }
}
