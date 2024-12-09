package edu.poly.hightstar.controller.admin;

import edu.poly.hightstar.model.UserProfileDTO;
import edu.poly.hightstar.service.CloudinaryService;
import edu.poly.hightstar.service.UserProfileService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/employee/user-profiles")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final CloudinaryService cloudinaryService;

    // Lấy tất cả hồ sơ người dùng
    @GetMapping
    public List<UserProfileDTO> getAllUserProfiles() {
        return userProfileService.getAllUserProfiles();
    }

    // Lấy hồ sơ người dùng theo ID
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER')")
    @GetMapping("/{id}")
    public UserProfileDTO getUserProfileById(@PathVariable Long id) {
        return userProfileService.getUserProfileById(id);
    }

    // Lấy hồ sơ người dùng theo userId
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE' ,'TRAINER', 'USER')")
    @GetMapping("/user/{userId}")
    public UserProfileDTO getProfileByUserId(@PathVariable Long userId) {
        return userProfileService.getProfileByUserId(userId);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE' ,'TRAINER', 'USER')")
    @PutMapping("/{id}")
    public UserProfileDTO updateUserProfile(
            @PathVariable Long id,
            @RequestPart("userProfile") String userProfileData,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            UserProfileDTO userProfileDTO = mapper.readValue(userProfileData, UserProfileDTO.class);
            UserProfileDTO existingUserProfile = userProfileService.getUserProfileById(id);

            // Xử lý hình ảnh nếu có, xóa hình ảnh cũ nếu có
            if (file != null && !file.isEmpty()) {
                handleImageDeletion(extractPublicId(existingUserProfile.getAvatar()));
                userProfileDTO.setAvatar(cloudinaryService.uploadImage(file, "user-profiles"));
            } else {
                userProfileDTO.setAvatar(existingUserProfile.getAvatar());
            }
            return userProfileService.updateUserProfile(id, userProfileDTO);

        } catch (IOException e) {
            // e.printStackTrace();
            throw new RuntimeException("Lỗi khi cập nhật huấn luyện viên: " + e.getMessage());
        }
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
