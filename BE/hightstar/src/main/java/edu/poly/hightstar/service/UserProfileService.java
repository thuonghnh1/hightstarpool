package edu.poly.hightstar.service;

import edu.poly.hightstar.model.UserProfileDTO;

import java.util.List;

public interface UserProfileService {

    // Lấy tất cả hồ sơ người dùng
    List<UserProfileDTO> getAllUserProfiles();

    // Lấy hồ sơ người dùng theo ID
    UserProfileDTO getUserProfileById(Long id);

    // Lấy hồ sơ người dùng theo userId
    UserProfileDTO getProfileByUserId(Long userId);

    // Cập nhật hồ sơ người dùng
    UserProfileDTO updateUserProfile(Long id, UserProfileDTO userProfileDTO);

    boolean isEmailExistsForUpdate(String email, Long userId);

    boolean isPhoneNumberExistsForUpdate(String phoneNumber, Long userId);
}
