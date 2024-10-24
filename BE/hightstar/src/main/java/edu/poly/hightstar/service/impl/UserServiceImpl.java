package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.User;
import edu.poly.hightstar.domain.UserProfile;
import edu.poly.hightstar.repository.UserProfileRepository;
import edu.poly.hightstar.repository.UserRepository;
import edu.poly.hightstar.service.UserService;
import lombok.RequiredArgsConstructor;
import edu.poly.hightstar.enums.Role;
import edu.poly.hightstar.enums.UserStatus;
import edu.poly.hightstar.model.RegisterDTO;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private UserProfileRepository userProfileRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Đăng ký người dùng mới
    public User registerUser(RegisterDTO registerDTO) {
        if (userRepository.findByEmail(registerDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại");
        }

        User newUser = new User();
        newUser.setUsername(registerDTO.getPhoneNumber()); // Username mặc định là sdt
        newUser.setEmail(registerDTO.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        newUser.setRole(Role.USER); // mặc định là user
        newUser.setStatus(UserStatus.ACTIVE); // Đặt mặc định là active
        // Tạo mới đối tượng UserProfile
        UserProfile newUserProfile = new UserProfile();
        newUserProfile.setFullName(registerDTO.getFullName());
        newUserProfile.setPhoneNumber(registerDTO.getPhoneNumber());
        newUserProfile.setUser(newUser);
        userProfileRepository.save(newUserProfile);
        return userRepository.save(newUser);
    }

    // // Đăng nhập
    // public Optional<User> login(LoginDTO loginDTO) {
    // Optional<User> userOpt =
    // userRepository.findByUsername(loginDTO.getUsername());
    // if (userOpt.isPresent()) {
    // User user = userOpt.get();
    // if (passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
    // return Optional.of(user);
    // }
    // }
    // return Optional.empty(); // Đăng nhập thất bại
    // }

    // // Đặt lại mật khẩu
    // public boolean resetPassword(String email, String newPassword) {
    // Optional<User> userOpt = userRepository.findByEmail(email);
    // if (userOpt.isPresent()) {
    // User user = userOpt.get();
    // user.setPassword(passwordEncoder.encode(newPassword));
    // userRepository.save(user);
    // return true;
    // }
    // return false;
    // }
}
