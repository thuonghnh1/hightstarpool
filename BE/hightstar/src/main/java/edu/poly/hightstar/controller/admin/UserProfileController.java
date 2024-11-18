package edu.poly.hightstar.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.poly.hightstar.domain.UserProfile;
import edu.poly.hightstar.service.UserProfileService;

@RestController
@RequestMapping("/api/user-profile")
public class UserProfileController {
    @Autowired
    private UserProfileService userProfileService;

    // Lấy thông tin hồ sơ người dùng
    @GetMapping("/{userId}")
    public ResponseEntity<UserProfile> getUserProfile(@PathVariable Long userId) {
        UserProfile userProfile = userProfileService.getUserProfileByUserId(userId);
        if (userProfile != null) {
            return ResponseEntity.ok(userProfile);
        }
        return ResponseEntity.notFound().build(); // Nếu không tìm thấy hồ sơ
    }

    // Cập nhật hồ sơ người dùng
    @PutMapping("/{userId}")
    public ResponseEntity<UserProfile> updateUserProfile(
            @PathVariable Long userId, @RequestBody UserProfile updatedProfile) {
        UserProfile userProfile = userProfileService.updateUserProfile(userId, updatedProfile);
        if (userProfile != null) {
            return ResponseEntity.ok(userProfile); // Trả về hồ sơ đã cập nhật
        }
        return ResponseEntity.notFound().build(); // Nếu không tìm thấy hồ sơ
    }
}
