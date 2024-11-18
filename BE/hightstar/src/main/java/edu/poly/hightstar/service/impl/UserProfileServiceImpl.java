package edu.poly.hightstar.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.poly.hightstar.domain.UserProfile;
import edu.poly.hightstar.repository.UserProfileRepository;
import edu.poly.hightstar.repository.UserRepository;
import edu.poly.hightstar.service.UserProfileService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {
    @Autowired
    private UserProfileRepository userProfileRepository;

    @Override
    public UserProfile getUserProfileByUserId(Long userId) {
        return userProfileRepository.findByUser_UserId(userId)
                .orElse(null); // Trả về null nếu không tìm thấy hồ sơ
    }

    @Override
    public UserProfile updateUserProfile(Long userId, UserProfile updatedProfile) {
        UserProfile existingProfile = userProfileRepository.findByUser_UserId(userId)
                .orElse(null); // Kiểm tra xem hồ sơ đã tồn tại chưa

        if (existingProfile != null) {
            existingProfile.setFullName(updatedProfile.getFullName());
            existingProfile.setAvatar(updatedProfile.getAvatar());
            existingProfile.setPhoneNumber(updatedProfile.getPhoneNumber());
            existingProfile.setDateOfBirth(updatedProfile.getDateOfBirth());
            existingProfile.setGender(updatedProfile.isGender());
            existingProfile.setBio(updatedProfile.getBio());

            return userProfileRepository.save(existingProfile);
        }
        return null;
    }
}
