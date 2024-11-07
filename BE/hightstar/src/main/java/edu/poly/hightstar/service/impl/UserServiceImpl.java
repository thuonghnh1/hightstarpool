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
import edu.poly.hightstar.model.UserDTO;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

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

    // THUONG

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            UserDTO dto = new UserDTO();
            System.out.println();
            BeanUtils.copyProperties(user, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            UserDTO userDto = new UserDTO();
            BeanUtils.copyProperties(user.get(), userDto);
            return userDto;
        }
        return null;
    }

    @Override
    public UserDTO getUserByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            Optional<UserProfile> userProfile = userProfileRepository.findByUser_UserId(user.get().getUserId());
            if (userProfile.isPresent()) {
                UserDTO userDto = new UserDTO();
                BeanUtils.copyProperties(user.get(), userDto);
                userDto.setFullName(userProfile.get().getFullName());
                return userDto;
            }
        }
        return null;
    }

    @Override
    public UserDTO createUser(UserDTO userDto) {
        User user = new User();
        BeanUtils.copyProperties(userDto, user);
        // Tạo mật khẩu ngẫu nhiên có 6 chữ số
        String defaultPassword = RandomStringUtils.randomAlphanumeric(6);
        user.setPassword(passwordEncoder.encode(defaultPassword)); // Mã hóa mật khẩu
        user.setUsername(userDto.getPhoneNumber()); // mặc định username là sđt
        User createdUser = userRepository.save(user);

        UserDTO createdUserDto = new UserDTO();
        BeanUtils.copyProperties(createdUser, createdUserDto);

        // Tạo tự động UserProfile
        // Tạo mới đối tượng UserProfile
        UserProfile newUserProfile = new UserProfile();
        newUserProfile.setFullName(userDto.getFullName());
        newUserProfile.setPhoneNumber(userDto.getPhoneNumber());
        newUserProfile.setUser(createdUser);
        userProfileRepository.save(newUserProfile);
        return createdUserDto;
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDto) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User userDetails = userOptional.get();
            BeanUtils.copyProperties(userDto, userDetails);
            User updatedUser = userRepository.save(userDetails);

            UserDTO updatedUserDto = new UserDTO();
            BeanUtils.copyProperties(updatedUser, updatedUserDto);
            return updatedUserDto;
        }
        return null;
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public boolean checkUserExists(Long id) {
        return userRepository.existsById(id);
    }

    @Override
    public boolean isPhoneNumberExists(String phoneNumber) {
        return userProfileRepository.existsByPhoneNumber(phoneNumber);
    }

    @Override
    public boolean isEmailExists(String email) {
        // Kiểm tra xem email có tồn tại trong database không
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean isEmailExistsForUpdate(String email, Long userId) {
        // Kiểm tra xem email có tồn tại trong database không
        return userRepository.existsByEmailAndUserIdNot(email, userId);
    }

}
