package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.User;
import edu.poly.hightstar.domain.UserProfile;
import edu.poly.hightstar.model.UserProfileDTO;
import edu.poly.hightstar.repository.UserProfileRepository;
import edu.poly.hightstar.repository.UserRepository;
import edu.poly.hightstar.service.UserProfileService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    // Lấy tất cả hồ sơ người dùng
    @Override
    public List<UserProfileDTO> getAllUserProfiles() {
        return userProfileRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Lấy hồ sơ người dùng theo ID
    @Override
    public UserProfileDTO getUserProfileById(Long id) {
        Optional<UserProfile> userProfile = userProfileRepository.findById(id);
        if (userProfile.isEmpty()) {
            throw new AppException("Không tìm thấy hồ sơ người dùng!", ErrorCode.USER_PROFILE_NOT_FOUND);
        }
        return convertToDTO(userProfile.get());
    }

    // Lấy hồ sơ người dùng theo userId
    @Override
    public UserProfileDTO getProfileByUserId(Long userId) {
        Optional<UserProfile> userProfile = userProfileRepository.findByUser_UserId(userId);
        if (userProfile.isEmpty()) {
            throw new AppException("Không tìm thấy hồ sơ người dùng này trên hệ thống!",
                    ErrorCode.USER_PROFILE_NOT_FOUND);
        }
        return convertToDTO(userProfile.get());
    }

    // Cập nhật hồ sơ người dùng
    @Override
    public UserProfileDTO updateUserProfile(Long id, UserProfileDTO userProfileDTO) {
        Optional<UserProfile> existingProfile = userProfileRepository.findById(id);
        if (existingProfile.isEmpty()) {
            throw new AppException("Không tìm thấy hồ sơ người dùng này trên hệ thống!",
                    ErrorCode.USER_PROFILE_NOT_FOUND);
        }

        // Kiểm tra email đã tồn tại
        if (isEmailExistsForUpdate(userProfileDTO.getEmail(), userProfileDTO.getUserId())) {
            throw new AppException("Email này đã được sử dụng!", ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        if (isPhoneNumberExistsForUpdate(userProfileDTO.getPhoneNumber(), userProfileDTO.getUserId())) {
            throw new AppException("Số điện thoại này đã được sử dụng!",
                    ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);
        }

        UserProfile userProfile = convertToEntity(userProfileDTO);
        userProfile.setProfileId(id);
        userProfile = userProfileRepository.save(userProfile);

        return convertToDTO(userProfile);
    }

    // Phương thức chuyển đổi từ UserProfile (Entity) sang UserProfileDTO
    private UserProfileDTO convertToDTO(UserProfile userProfile) {
        UserProfileDTO userProfileDTO = new UserProfileDTO();
        try {
            BeanUtils.copyProperties(userProfile, userProfileDTO); // Sử dụng BeanUtils để sao chép thuộc tính
            userProfileDTO.setUserId(userProfile.getUser().getUserId());
            userProfileDTO.setEmail(userProfile.getUser().getEmail());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Đã xảy ra lỗi. Vui lòng thử lại sau!", e);
        }
        return userProfileDTO;
    }

    // Phương thức chuyển đổi từ UserProfileDTO sang UserProfile (Entity)
    private UserProfile convertToEntity(UserProfileDTO userProfileDTO) {
        UserProfile userProfile = new UserProfile();
        try {
            BeanUtils.copyProperties(userProfileDTO, userProfile); // Sử dụng BeanUtils để sao chép thuộc tính
            if (userProfileDTO.getUserId() != null) {
                User user = userRepository.findById(userProfileDTO.getUserId())
                        .orElseThrow(() -> new AppException("Không tìm thấy người dùng này trong hệ thống!",
                                ErrorCode.USER_NOT_FOUND));
                userProfile.setUser(user);
                // nếu email khác thì cập nhật lại email
                if (userProfileDTO.getEmail() != user.getEmail()) {
                    user.setEmail(userProfileDTO.getEmail());
                    userRepository.save(user);
                }
                if (userProfileDTO.getPhoneNumber() != user.getUsername()) {
                    user.setUsername(userProfileDTO.getPhoneNumber());
                    userRepository.save(user);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Đã xảy ra lỗi. Vui lòng thử lại sau!", e);
        }
        return userProfile;
    }

    @Override
    public boolean isPhoneNumberExistsForUpdate(String phoneNumber, Long userId) {

        // Kiểm tra xem số điện thoại có tồn tại trong database không
        return userProfileRepository.existsByPhoneNumberAndUserUserIdNot(phoneNumber, userId);
    }

    @Override
    public boolean isEmailExistsForUpdate(String email, Long userId) {
        // Kiểm tra xem email có tồn tại trong database không
        return userRepository.existsByEmailAndUserIdNot(email, userId);
    }
}
