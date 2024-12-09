package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.User;
import edu.poly.hightstar.domain.UserProfile;
import edu.poly.hightstar.repository.UserProfileRepository;
import edu.poly.hightstar.repository.UserRepository;
import edu.poly.hightstar.service.EmailService;
import edu.poly.hightstar.service.UserService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import edu.poly.hightstar.utils.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import edu.poly.hightstar.enums.Role;
import edu.poly.hightstar.enums.UserStatus;
import edu.poly.hightstar.model.LoginDTO;
import edu.poly.hightstar.model.LoginResponse;
import edu.poly.hightstar.model.RegisterDTO;
import edu.poly.hightstar.model.UserDTO;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    @Transactional
    @Override
    public UserDTO registerUser(RegisterDTO registerDTO) {
        if (userRepository.findByEmail(registerDTO.getEmail()).isPresent()) {
            throw new AppException("Email này đã được sử dụng!", ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        if (userRepository.findByUsername(registerDTO.getPhoneNumber()).isPresent()) {
            throw new AppException("Số điện thoại này đã được sử dụng!", ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);
        }

        User newUser = new User();
        newUser.setUsername(registerDTO.getPhoneNumber());
        newUser.setEmail(registerDTO.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        newUser.setRole(Role.USER);
        newUser.setStatus(UserStatus.ACTIVE);

        UserProfile newUserProfile = new UserProfile();
        newUserProfile.setFullName(registerDTO.getFullName());
        newUserProfile.setPhoneNumber(registerDTO.getPhoneNumber());
        newUserProfile.setUser(newUser);

        userProfileRepository.save(newUserProfile);
        User savedUser = userRepository.save(newUser);

        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(savedUser, userDTO);
        userDTO.setFullName(newUserProfile.getFullName());
        userDTO.setPassword(""); // bảo mật password
        return userDTO;
    }

    @Override
    public LoginResponse loginUser(LoginDTO loginDTO, HttpServletResponse response) {
        Optional<User> userOptional = userRepository.findByUsername(loginDTO.getUsername());
        if (!userOptional.isPresent()
                || !passwordEncoder.matches(loginDTO.getPassword(), userOptional.get().getPassword())) {
            System.out.println(loginDTO.getPassword() + "--" + userOptional.get().getPassword());
            throw new AppException("Thông tin đăng nhập không chính xác!", ErrorCode.INVALID_LOGIN);
        }

        User user = userOptional.get();
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new AppException("Tài khoản của bạn đang bị khóa!", ErrorCode.ACCOUNT_LOCKED);
        }

        Optional<UserProfile> userProfile = userProfileRepository.findByUser_UserId(user.getUserId());
        UserProfile profile = userProfile.orElseThrow(
                () -> new AppException("Không tìm thấy hồ sơ người dùng!", ErrorCode.USER_PROFILE_NOT_FOUND));

        String accessToken = jwtTokenProvider.generateToken(user.getUsername(), List.of(user.getRole()),
                user.getUserId());
        String refreshToken = "Bearer " + jwtTokenProvider.generateRefreshToken(user.getUsername());

        response.setHeader("Authorization", "Bearer " + accessToken);

        LoginResponse loginResponse = new LoginResponse(user.getUserId(), profile.getFullName(),
                user.getEmail(), profile.getAvatar(), user.getRole(), accessToken, refreshToken);
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        return loginResponse;
    }

    @Override
    public boolean resetPassword(String phoneNumber, String newPassword) {
        // Tìm người dùng theo số điện thoại
        Optional<User> userOptional = userRepository.findByUsername(phoneNumber);

        // Kiểm tra người dùng có tồn tại không
        if (!userOptional.isPresent()) {
            return false;
        }
        User user = new User();
        user = userOptional.get();
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);
        SendEmailNotification(user); // gửi email thông báo
        return true;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            UserDTO dto = new UserDTO();
            System.out.println();
            BeanUtils.copyProperties(user, dto);
            dto.setPassword("");
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            UserDTO userDto = new UserDTO();
            BeanUtils.copyProperties(user.get(), userDto);
            userDto.setPassword("");
            return userDto;
        }
        throw new AppException("Người dùng này không tồn tại trong hệ thống!", ErrorCode.USER_NOT_FOUND);
    }

    @Override
    public boolean verifyPassword(Long userId, String password) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new AppException("Người dùng này không tồn tại trong hệ thống!", ErrorCode.USER_NOT_FOUND);
        }
        if (!passwordEncoder.matches(password, userOptional.get().getPassword())) {
            throw new AppException("Mật khẩu không chính xác!", ErrorCode.INVALID_LOGIN);
        }
        return true;
    }

    @Override
    public boolean changePassword(Long userId, String password, String newPassword) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new AppException("Người dùng này không tồn tại trong hệ thống!", ErrorCode.USER_NOT_FOUND);
        }
        if (!passwordEncoder.matches(password, userOptional.get().getPassword())) {
            throw new AppException("Mật khẩu cũ không chính xác!", ErrorCode.INVALID_LOGIN);
        }
        User user = userOptional.get();
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        return true;
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
                userDto.setPhoneNumber(userProfile.get().getPhoneNumber());
                userDto.setPassword("");
                return userDto;
            }
        }
        throw new AppException("Người dùng này không tồn tại trong hệ thống!", ErrorCode.USER_NOT_FOUND);
    }

    @Override
    public UserDTO createUser(UserDTO userDto) {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new AppException("Email đã tồn tại!", ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        if (userRepository.findByUsername(userDto.getPhoneNumber()).isPresent()) {
            throw new AppException("Số điện thoại đã tồn tại!", ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);
        }

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
        createdUserDto.setFullName(userDto.getFullName());
        createdUserDto.setPhoneNumber(userDto.getPhoneNumber());
        SendEmail(createdUserDto, defaultPassword);
        createdUserDto.setPassword("");
        return createdUserDto;
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDto) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            userDto.setPassword(user.getPassword());// lấy pass ra và lưu lại để pass lúc đầu là rổng để gửi an toàn
            BeanUtils.copyProperties(userDto, user);
            User updatedUser = userRepository.save(user);

            UserDTO updatedUserDto = new UserDTO();
            BeanUtils.copyProperties(updatedUser, updatedUserDto);
            updatedUserDto.setPassword("");
            return updatedUserDto;
        }
        throw new AppException("Người dùng này không tồn tại trong hệ thống!", ErrorCode.USER_NOT_FOUND);
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

    private void SendEmail(UserDTO userDTO, String defaultPassword) {

        String emailSubject = "Tài khoản của bạn đã được tạo thành công";

        String emailBody = "<html>" +
                "<head>" +
                "<style>" +
                "    body { font-family: Arial, sans-serif; line-height: 1.6; }" +
                "    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }"
                +
                "    h1 { color: #333; }" +
                "    .info { background-color: #f9f9f9; padding: 15px; border: 1px solid #e1e1e1; border-radius: 5px; }"
                +
                "    .footer { margin-top: 20px; font-size: 0.9em; color: #666; text-align: center; }" +
                "    .footer strong { color: #333; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div style='text-align: center; margin-bottom: 20px;'>" +
                "            <img src='https://res.cloudinary.com/da0i2y1qu/image/upload/v1731420581/logoVertical_q1nbbl.png' alt='Hight Star Logo' style='width: 150px; height: auto;' />"
                +
                "        </div>" +
                "        <h1>Kính gửi " + userDTO.getFullName() + ",</h1>" +
                "        <p>Chúng tôi vui mừng thông báo rằng tài khoản của bạn đã được tạo thành công. "
                +
                "        Dưới đây là thông tin đăng nhập của bạn:</p>" +
                "        <div class='info'>" +
                "            <strong>Tên đăng nhập:</strong> " + userDTO.getPhoneNumber() + "<br>" +
                "            <strong>Mật khẩu:</strong> " + defaultPassword +
                "        </div>" +
                "        <p>Vui lòng đăng nhập và thay đổi mật khẩu ngay khi có thể để đảm bảo an toàn cho tài khoản của bạn.</p>"
                +
                "        <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>" +
                "        <div class='footer'>" +
                "            <p>Chân thành cảm ơn bạn,<br><strong>Đội ngũ hỗ trợ khách hàng</strong></p>"
                +
                "            <p><strong>Hight Star</strong><br>" +
                "            Email: hightstarpoolcompany@gmail.com | Hotline: 0888-372-325</p>" +
                "            <p>Đây là email tự động từ phần mềm Hight Star. Vui lòng không trả lời email này.</p>"
                +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";

        emailService.sendHtmlEmail(userDTO.getEmail(), emailSubject, emailBody);
    }

    private void SendEmailNotification(User user) {

        String emailSubject = "Mật khẩu của bạn đã được thay đổi thành công";

        String emailBody = "<html>" +
                "<head>" +
                "<style>" +
                "    body { font-family: Arial, sans-serif; line-height: 1.6; }" +
                "    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }"
                +
                "    h1 { color: #333; }" +
                "    .info { background-color: #f9f9f9; padding: 15px; border: 1px solid #e1e1e1; border-radius: 5px; }"
                +
                "    .footer { margin-top: 20px; font-size: 0.9em; color: #666; text-align: center; }" +
                "    .footer strong { color: #333; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div style='text-align: center; margin-bottom: 20px;'>" +
                "            <img src='https://res.cloudinary.com/da0i2y1qu/image/upload/v1731420581/logoVertical_q1nbbl.png' alt='Hight Star Logo' style='width: 150px; height: auto;' />"
                +
                "        </div>" +
                "        <h1>Kính gửi bạn,</h1>" +
                "        <p>Chúng tôi xin thông báo rằng mật khẩu tài khoản của bạn đã được thay đổi thành công. Nếu bạn không yêu cầu thay đổi mật khẩu này, vui lòng liên hệ ngay với chúng tôi để đảm bảo an toàn cho tài khoản của bạn.</p>"
                +
                "        <div class='info'>" +
                "            <p><strong>Tên đăng nhập:</strong> " + user.getUsername() + "</p>" +
                "        </div>" +
                "        <p>Nếu bạn cần hỗ trợ thêm, đừng ngần ngại liên hệ với chúng tôi qua thông tin bên dưới.</p>" +
                "        <div class='footer'>" +
                "            <p>Chân thành cảm ơn bạn,<br><strong>Đội ngũ hỗ trợ khách hàng</strong></p>" +
                "            <p><strong>Hight Star</strong><br>" +
                "            Email: hightstarpoolcompany@gmail.com | Hotline: 0888-372-325</p>" +
                "            <p>Đây là email tự động từ phần mềm Hight Star. Vui lòng không trả lời email này.</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";

        emailService.sendHtmlEmail(user.getEmail(), emailSubject, emailBody);
    }

}
