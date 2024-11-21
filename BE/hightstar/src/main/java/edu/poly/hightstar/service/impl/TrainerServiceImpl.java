package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.Trainer;
import edu.poly.hightstar.domain.User;
import edu.poly.hightstar.domain.UserProfile;
import edu.poly.hightstar.enums.UserStatus;
import edu.poly.hightstar.enums.Role;
import edu.poly.hightstar.model.TrainerDTO;
import edu.poly.hightstar.repository.TrainerRepository;
import edu.poly.hightstar.repository.UserRepository;
import edu.poly.hightstar.repository.UserProfileRepository;
import edu.poly.hightstar.service.EmailService;
import edu.poly.hightstar.service.TrainerService;
import edu.poly.hightstar.utils.exception.ErrorCode;
import edu.poly.hightstar.utils.exception.AppException;
import lombok.RequiredArgsConstructor;
import java.util.stream.Collectors;
import java.util.List;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Thêm import này
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TrainerServiceImpl implements TrainerService {

        private final TrainerRepository trainerRepository;
        private final UserRepository userRepository;
        private final UserProfileRepository userProfileRepository;
        private final EmailService emailService;
        private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // Thêm mã hóa mật khẩu

        @Override
        @Transactional // Đảm bảo rằng tất cả các thao tác bên trong phương thức đó được thực hiện
                       // trong một giao dịch duy nhất

        public TrainerDTO createTrainer(TrainerDTO trainerDTO) {
                if (userRepository.findByEmail(trainerDTO.getEmail()).isPresent()) {
                        throw new AppException("Email này đã được sử dụng!", ErrorCode.EMAIL_ALREADY_EXISTS);
                }
                if (userRepository.findByUsername(trainerDTO.getPhoneNumber()).isPresent()) {
                        throw new AppException("Số điện thoại này đã được sử dụng!",
                                        ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);

                }

                // Tạo mới đối tượng User
                User newUser = new User();
                newUser.setUsername(trainerDTO.getPhoneNumber()); // Sử dụng sđt làm username
                // Tạo mật khẩu ngẫu nhiên có 6 chữ số
                String defaultPassword = RandomStringUtils.randomAlphanumeric(6);
                newUser.setPassword(passwordEncoder.encode(defaultPassword)); // Mã hóa mật khẩu
                newUser.setEmail(trainerDTO.getEmail());
                newUser.setRole(Role.TRAINER); // Gán vai trò là huấn luyện viên
                newUser.setStatus(UserStatus.ACTIVE); // Trạng thái hoạt động
                User savedUser = userRepository.save(newUser);

                // Tạo mới đối tượng UserProfile
                UserProfile newUserProfile = new UserProfile();
                newUserProfile.setFullName(trainerDTO.getFullName());
                newUserProfile.setPhoneNumber(trainerDTO.getPhoneNumber());
                newUserProfile.setGender(trainerDTO.isGender());
                newUserProfile.setUser(savedUser);
                userProfileRepository.save(newUserProfile);

                // Tạo mới Trainer
                Trainer newTrainer = new Trainer();
                newTrainer.setUser(savedUser);
                newTrainer.setSpecialty(trainerDTO.getSpecialty());
                newTrainer.setExperienceYears(trainerDTO.getExperienceYears());
                newTrainer.setSchedule(trainerDTO.getSchedule());
                newTrainer.setRating(trainerDTO.getRating());
                Trainer savedTrainer = trainerRepository.save(newTrainer);

                // Gửi email chứa mật khẩu tới người dùng mới
                SendEmail(trainerDTO, defaultPassword);
                // Chuyển đổi thành trainerDTO để trả về
                return convertToDto(savedTrainer, savedUser, newUserProfile);
        }

        @Override
        @Transactional
        public TrainerDTO updateTrainer(Long trainerId, TrainerDTO trainerDTO) {

                // Tìm Trainer theo id
                Trainer trainer = trainerRepository.findById(trainerId)
                                .orElseThrow(() -> new AppException("Không tìm thấy HLV này trong hệ thống!",
                                                ErrorCode.TRAINER_NOT_FOUND));

                // Kiểm tra số điện thoại đã tồn tại
                if (isPhoneNumberExistsForUpdate(trainerDTO.getPhoneNumber(), trainerId)) {
                        throw new AppException("Số điện thoại này đã được sử dụng!",
                                        ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);
                }

                // Kiểm tra email đã tồn tại
                if (isEmailExistsForUpdate(trainerDTO.getEmail(), trainerId)) {
                        throw new AppException("Email này đã được sử dụng!", ErrorCode.EMAIL_ALREADY_EXISTS);
                }
                // Cập nhật Trainer
                trainer.setSpecialty(trainerDTO.getSpecialty());
                trainer.setExperienceYears(trainerDTO.getExperienceYears());
                trainer.setRating(trainerDTO.getRating());
                trainer.setSchedule(trainerDTO.getSchedule());
                trainerRepository.save(trainer);

                // Cập nhật User và UserProfile liên quan
                User user = userRepository.findById(trainerDTO.getUserId())
                                .orElseThrow(() -> new AppException(
                                                "Không tìm thấy tài khoản của HLV này trong hệ thống!",
                                                ErrorCode.USER_NOT_FOUND));
                user.setEmail(trainerDTO.getEmail());
                user.setStatus(trainerDTO.getStatus());
                userRepository.save(user);

                UserProfile userProfile = userProfileRepository.findByUser_UserId(trainerDTO.getUserId())
                                .orElseThrow(() -> new AppException("Không tìm thấy hồ sơ của HLV này trong hệ thống!",
                                                ErrorCode.USER_PROFILE_NOT_FOUND));
                userProfile.setFullName(trainerDTO.getFullName());
                userProfile.setPhoneNumber(trainerDTO.getPhoneNumber());
                userProfile.setGender(trainerDTO.isGender());
                userProfileRepository.save(userProfile);

                return convertToDto(trainer, user, userProfile);
        }

        @Override
        public List<TrainerDTO> getAllTrainers() {

                // Lấy tất cả các Trainer từ repository và chuyển đổi sang TrainerDto
                List<Trainer> trainers = trainerRepository.findAll();
                return trainers.stream()
                                .map(trainer -> {
                                        User user = trainer.getUser();
                                        UserProfile userProfile = userProfileRepository
                                                        .findByUser_UserId(user.getUserId())
                                                        .orElseThrow(() -> new AppException(
                                                                        "Không tìm thấy HLV này trong hệ thống!",
                                                                        ErrorCode.TRAINER_NOT_FOUND));
                                        return convertToDto(trainer, user, userProfile);
                                })
                                .collect(Collectors.toList());
        }

        @Override
        public TrainerDTO getTrainerById(Long id) {

                // Tìm Trainer theo id và chuyển đổi sang TrainerDto
                Trainer trainer = trainerRepository.findById(id)
                                .orElseThrow(() -> new AppException("Không tìm thấy HLV này trong hệ thống!",
                                                ErrorCode.TRAINER_NOT_FOUND));
                User user = trainer.getUser();
                UserProfile userProfile = userProfileRepository.findByUser_UserId(user.getUserId())
                                .orElseThrow(() -> new AppException("Không tìm thấy HLV này trong hệ thống!",
                                                ErrorCode.TRAINER_NOT_FOUND));
                return convertToDto(trainer, user, userProfile);
        }

        @Override
        @Transactional
        public void deleteTrainer(Long id) {
                Trainer trainer = trainerRepository.findById(id)
                                .orElseThrow(() -> new AppException("Không tìm thấy HLV này trong hệ thống!",
                                                ErrorCode.TRAINER_NOT_FOUND));
                // Xóa UserProfile và User liên quan
                User user = trainer.getUser();
                userProfileRepository.deleteByUser_UserId(user.getUserId());
                userRepository.deleteById(user.getUserId());
                trainerRepository.delete(trainer);
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

        // Chuyển đổi từ Trainer, User, UserProfile thành TrainerDto
        private TrainerDTO convertToDto(Trainer trainer, User user, UserProfile userProfile) {
                TrainerDTO trainerDTO = new TrainerDTO();
                // BeanUtils sẽ chỉ sao chép những thuộc tính có cùng tên và kiểu dl
                BeanUtils.copyProperties(userProfile, trainerDTO);
                BeanUtils.copyProperties(user, trainerDTO);
                BeanUtils.copyProperties(trainer, trainerDTO);
                return trainerDTO;
        }

        private void SendEmail(TrainerDTO trainerDTO, String defaultPassword) {

                String emailSubject = "Tài khoản HLV của bạn đã được tạo thành công";

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
                                "        <h1>Kính gửi " + trainerDTO.getFullName() + ",</h1>" +
                                "        <p>Chúng tôi vui mừng thông báo rằng tài khoản HLV của bạn đã được tạo thành công. "
                                +
                                "        Dưới đây là thông tin đăng nhập của bạn:</p>" +
                                "        <div class='info'>" +
                                "            <strong>Tên đăng nhập:</strong> " + trainerDTO.getPhoneNumber() + "<br>" +
                                "            <strong>Mật khẩu:</strong> " + defaultPassword +
                                "        </div>" +
                                "        <p>Vui lòng đăng nhập và thay đổi mật khẩu ngay khi có thể để đảm bảo an toàn cho tài khoản của bạn.</p>"
                                +
                                "        <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>" +
                                "        <div class='footer'>" +
                                "            <p>Chân thành cảm ơn bạn,<br><strong>Đội ngũ hỗ trợ khách hàng</strong></p>"
                                +
                                "            <p><strong>Hight Star</strong><br>" +
                                "            Email: support@hightstar.com | Hotline: 0888-372-325</p>" +
                                "            <p>Đây là email tự động từ phần mềm Hight Star. Vui lòng không trả lời email này.</p>"
                                +
                                "        </div>" +
                                "    </div>" +
                                "</body>" +
                                "</html>";

                emailService.sendHtmlEmail(trainerDTO.getEmail(), emailSubject, emailBody);
        }
}
