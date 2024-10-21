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
        public TrainerDTO createTrainer(TrainerDTO trainerDto) {
                // Tạo mới đối tượng User
                User newUser = new User();
                newUser.setUsername(trainerDto.getPhoneNumber()); // Sử dụng sđt làm username
                // Tạo mật khẩu ngẫu nhiên có 6 chữ số
                String defaultPassword = RandomStringUtils.randomAlphanumeric(6);
                newUser.setPassword(passwordEncoder.encode(defaultPassword)); // Mã hóa mật khẩu
                newUser.setEmail(trainerDto.getEmail());
                newUser.setRole(Role.TRAINER); // Gán vai trò là huấn luyện viên
                newUser.setStatus(UserStatus.ACTIVE); // Trạng thái hoạt động
                User savedUser = userRepository.save(newUser);

                // Tạo mới đối tượng UserProfile
                UserProfile newUserProfile = new UserProfile();
                newUserProfile.setFullName(trainerDto.getFullName());
                newUserProfile.setPhoneNumber(trainerDto.getPhoneNumber());
                newUserProfile.setGender(trainerDto.isGender());
                newUserProfile.setUser(savedUser);
                userProfileRepository.save(newUserProfile);

                // Tạo mới Trainer
                Trainer newTrainer = new Trainer();
                newTrainer.setUser(savedUser);
                newTrainer.setSpecialty(trainerDto.getSpecialty());
                newTrainer.setExperienceYears(trainerDto.getExperienceYears());
                newTrainer.setSchedule(trainerDto.getSchedule());
                newTrainer.setRating(trainerDto.getRating());
                Trainer savedTrainer = trainerRepository.save(newTrainer);

                // Gửi email chứa mật khẩu tới người dùng mới
                SendEmail(trainerDto, defaultPassword);
                // Chuyển đổi thành TrainerDto để trả về
                return convertToDto(savedTrainer, savedUser, newUserProfile);
        }

        @Override
        @Transactional
        public TrainerDTO updateTrainer(Long trainerId, TrainerDTO trainerDto) {
                // Tìm Trainer theo id
                Trainer trainer = trainerRepository.findById(trainerId)
                                .orElseThrow(() -> new RuntimeException("Trainer not found"));

                // Cập nhật Trainer
                trainer.setSpecialty(trainerDto.getSpecialty());
                trainer.setExperienceYears(trainerDto.getExperienceYears());
                trainer.setRating(trainerDto.getRating());
                trainer.setSchedule(trainerDto.getSchedule());
                trainerRepository.save(trainer);

                // Cập nhật User và UserProfile liên quan
                User user = userRepository.findById(trainerDto.getUserId())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                user.setEmail(trainerDto.getEmail());
                user.setStatus(trainerDto.getStatus());
                userRepository.save(user);

                UserProfile userProfile = userProfileRepository.findByUser_UserId(trainerDto.getUserId())
                                .orElseThrow(() -> new RuntimeException("UserProfile not found"));
                userProfile.setFullName(trainerDto.getFullName());
                userProfile.setPhoneNumber(trainerDto.getPhoneNumber());
                userProfile.setGender(trainerDto.isGender());
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
                                        UserProfile userProfile = userProfileRepository.findByUser_UserId(user.getUserId())
                                                        .orElseThrow(() -> new RuntimeException(
                                                                        "UserProfile not found"));
                                        return convertToDto(trainer, user, userProfile);
                                })
                                .collect(Collectors.toList());
        }

        @Override
        public TrainerDTO getTrainerById(Long id) {
                // Tìm Trainer theo id và chuyển đổi sang TrainerDto
                Trainer trainer = trainerRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Trainer not found"));
                User user = trainer.getUser();
                UserProfile userProfile = userProfileRepository.findByUser_UserId(user.getUserId())
                                .orElseThrow(() -> new RuntimeException("UserProfile not found"));
                return convertToDto(trainer, user, userProfile);
        }

        @Override
        @Transactional
        public void deleteTrainer(Long id) {
                Trainer trainer = trainerRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Trainer not found"));

                // Xóa UserProfile và User liên quan
                User user = trainer.getUser();
                userProfileRepository.deleteByUser_UserId(user.getUserId());
                userRepository.deleteById(user.getUserId());
                trainerRepository.delete(trainer);
        }

        // Chuyển đổi từ Trainer, User, UserProfile thành TrainerDto
        private TrainerDTO convertToDto(Trainer trainer, User user, UserProfile userProfile) {
                TrainerDTO trainerDto = new TrainerDTO();
                // BeanUtils sẽ chỉ sao chép những thuộc tính có cùng tên và kiểu dl
                BeanUtils.copyProperties(userProfile, trainerDto);
                BeanUtils.copyProperties(user, trainerDto);
                BeanUtils.copyProperties(trainer, trainerDto);
                return trainerDto;
        }

        private void SendEmail(TrainerDTO trainerDto, String defaultPassword) {
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
                                "    .footer { margin-top: 20px; font-size: 0.9em; color: #666; }" +
                                "</style>" +
                                "</head>" +
                                "<body>" +
                                "    <div class='container'>" +
                                "        <h1>Kính gửi " + trainerDto.getFullName() + ",</h1>" +
                                "        <p>Chúng tôi vui mừng thông báo rằng tài khoản HLV của bạn đã được tạo thành công. "
                                +
                                "        Dưới đây là thông tin đăng nhập của bạn:</p>" +
                                "        <div class='info'>" +
                                "            <strong>Tên đăng nhập:</strong> " + trainerDto.getPhoneNumber() + "<br>" +
                                "            <strong>Mật khẩu:</strong> " + defaultPassword +
                                "        </div>" +
                                "        <p>Vui lòng đăng nhập và thay đổi mật khẩu ngay khi có thể để đảm bảo an toàn cho tài khoản của bạn.</p>"
                                +
                                "        <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>" +
                                "        <div class='footer'>" +
                                "            <p>Chân thành cảm ơn bạn,<br>Đội ngũ hỗ trợ khách hàng.</p>" +
                                "        </div>" +
                                "    </div>" +
                                "</body>" +
                                "</html>";

                emailService.sendHtmlEmail(trainerDto.getEmail(), emailSubject, emailBody);
        }
}
