package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.User;
import edu.poly.hightstar.domain.UserProfile;
import edu.poly.hightstar.repository.UserProfileRepository;
import edu.poly.hightstar.repository.UserRepository;
import edu.poly.hightstar.service.UserService;
import lombok.RequiredArgsConstructor;
import edu.poly.hightstar.enums.Role;
import edu.poly.hightstar.enums.UserStatus;
import edu.poly.hightstar.exception.InvalidPasswordException;
import edu.poly.hightstar.exception.UserAlreadyExistsException;
import edu.poly.hightstar.exception.UserNotFoundException;
import edu.poly.hightstar.model.LoginDTO;
import edu.poly.hightstar.model.RegisterDTO;
import edu.poly.hightstar.model.UserDTO;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Đăng ký người dùng mới
    public User registerUser(RegisterDTO registerDTO) {
        // Kiểm tra nếu email đã tồn tại
        if (userRepository.findByEmail(registerDTO.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email đã tồn tại");
        }

        // Kiểm tra nếu số điện thoại đã tồn tại
        if (userProfileRepository.existsByPhoneNumber(registerDTO.getPhoneNumber())) {
            throw new UserAlreadyExistsException("Số điện thoại đã tồn tại");
        }

        // Tạo người dùng mới
        User newUser = new User();
        newUser.setUsername(registerDTO.getPhoneNumber()); // Username mặc định là sdt
        newUser.setEmail(registerDTO.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        newUser.setRole(registerDTO.getRole() != null ? registerDTO.getRole() : Role.USER); // Role mặc định là USER
        newUser.setStatus(UserStatus.ACTIVE); // Đặt mặc định là ACTIVE

        // Tạo mới đối tượng UserProfile
        UserProfile newUserProfile = new UserProfile();
        newUserProfile.setFullName(registerDTO.getFullName());
        newUserProfile.setPhoneNumber(registerDTO.getPhoneNumber());
        newUserProfile.setUser(newUser);

        // Lưu UserProfile và User vào database
        userProfileRepository.save(newUserProfile);
        return userRepository.save(newUser);
    }

    // Đăng nhập (kiểm tra tài khoản và mật khẩu)
    public UserDTO loginUser(LoginDTO loginDTO) {
        Optional<User> userOptional = userRepository.findByUsername(loginDTO.getUsername());
        if (!userOptional.isPresent()) {
            throw new UserNotFoundException("Tài khoản không tồn tại");
        }

        User user = userOptional.get();
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Mật khẩu sai");
        }

        // Chuyển đổi từ User thành UserDTO để trả về
        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO);
        return userDTO;
    }

    // Lấy tất cả người dùng
    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            UserDTO dto = new UserDTO();
            BeanUtils.copyProperties(user, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    // Lấy thông tin người dùng theo id
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

    // Tạo người dùng mới
    @Override
    public UserDTO createUser(UserDTO userDto) {
        // Kiểm tra nếu email đã tồn tại
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new UserAlreadyExistsException("Email đã tồn tại");
        }

        // Kiểm tra nếu số điện thoại đã tồn tại
        if (userProfileRepository.existsByPhoneNumber(userDto.getPhoneNumber())) {
            throw new UserAlreadyExistsException("Số điện thoại đã tồn tại");
        }

        User user = new User();
        BeanUtils.copyProperties(userDto, user);
        String defaultPassword = RandomStringUtils.randomAlphanumeric(6);
        user.setPassword(passwordEncoder.encode(defaultPassword)); // Mã hóa mật khẩu
        user.setUsername(userDto.getPhoneNumber()); // Mặc định username là số điện thoại
        User createdUser = userRepository.save(user);

        UserDTO createdUserDto = new UserDTO();
        BeanUtils.copyProperties(createdUser, createdUserDto);

        UserProfile newUserProfile = new UserProfile();
        newUserProfile.setFullName(userDto.getFullName());
        newUserProfile.setPhoneNumber(userDto.getPhoneNumber());
        newUserProfile.setUser(createdUser);
        userProfileRepository.save(newUserProfile);

        return createdUserDto;
    }

    // Cập nhật thông tin người dùng
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

    // Xóa người dùng
    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // Kiểm tra người dùng tồn tại hay không
    public boolean checkUserExists(Long id) {
        return userRepository.existsById(id);
    }

    @Override
    public boolean isPhoneNumberExists(String phoneNumber) {
        return userProfileRepository.existsByPhoneNumber(phoneNumber);
    }

    @Override
    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean isEmailExistsForUpdate(String email, Long userId) {
        return userRepository.existsByEmailAndUserIdNot(email, userId);
    }

    // Kiểm tra quyền người dùng (admin hay user)
    public boolean isAdmin(User user) {
        return user.getRole() == Role.ADMIN;
    }
}
