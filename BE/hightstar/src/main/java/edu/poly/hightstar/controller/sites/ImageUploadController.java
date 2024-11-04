package edu.poly.hightstar.controller.sites;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/images")
public class ImageUploadController {

    private final String UPLOAD_DIR = "src/main/resources/static/uploads/";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam("image") MultipartFile file,
            @RequestParam("type") String type) {

        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
        }

        // Xác định thư mục lưu trữ dựa trên loại ảnh
        String subFolder;
        String prefix;
        switch (type.toLowerCase()) {
            case "course":
                subFolder = "course/";
                prefix = "course_";
                break;
            case "avatar":
                subFolder = "avatar/";
                prefix = "avatar_";
                break;
            case "student":
                subFolder = "student/";
                prefix = "student_";
                break;
            default:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid type");
        }

        // Tạo đường dẫn file
        String fileName = prefix + UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + subFolder + fileName);

        try {
            // Tạo thư mục nếu chưa tồn tại
            Files.createDirectories(filePath.getParent());

            // Lưu file vào thư mục tương ứng
            Files.copy(file.getInputStream(), filePath);

            // Trả về đường dẫn để lưu vào cơ sở dữ liệu
            String fileUrl = "/uploads/" + subFolder + fileName;
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not save the file");
        }
    }
}
