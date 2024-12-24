package edu.poly.hightstar.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private static final int OTP_EXPIRY_MINUTES = 2;
    private final EmailService emailService;

    // Tạo OTP ngẫu nhiên
    public String sendOtp(String phoneNumber, String email) {
        String otp = "%06d".formatted(new Random().nextInt(999999));// tạo OTP 6 chữ số
        otpStorage.put(phoneNumber, new OtpData(otp, LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES)));
        sendOtpEmail(email, otp); // gửi email
        return otp;
    }

    // Kiểm tra OTP hợp lệ
    public boolean validateOtp(String phoneNumber, String otp) {
        OtpData otpData = otpStorage.get(phoneNumber);
        if (otpData != null && otpData.getExpiryTime().isAfter(LocalDateTime.now()) && otpData.getOtp().equals(otp)) {
            otpStorage.remove(phoneNumber); // Xóa OTP sau khi sử dụng
            return true;
        }
        return false;
    }

    // Lớp lưu trữ OTP và thời gian hết hạn
    private static class OtpData {
        private final String otp;
        private final LocalDateTime expiryTime;

        public OtpData(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getExpiryTime() {
            return expiryTime;
        }
    }

    // Phương thức gửi OTP với nội dung email HTML
    public void sendOtpEmail(String to, String otpCode) {
        String subject = "Mã OTP của bạn từ Hight Star";

        String emailBody = "<html>" +
                "<head>" +
                "<style>" +
                "    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                "    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #ffffff; }"
                +
                "    h1 { color: #333; font-size: 1.5em; }" +
                "    .otp-code { font-size: 1.8em; font-weight: bold; color: #4CAF50; padding: 10px; background-color: #f4f4f4; border: 1px solid #ddd; border-radius: 5px; text-align: center; }"
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
                "        <h1>Xin chào,</h1>" +
                "        <p>Bạn đã yêu cầu mã OTP để xác thực tài khoản tại Hight Star.</p>" +
                "        <p>Dưới đây là mã OTP của bạn:</p>" +
                "        <div class='otp-code'>" + otpCode + "</div>" +
                "        <p>Mã OTP này có hiệu lực trong vòng <strong>1 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>"
                +
                "        <p>Nếu bạn không yêu cầu mã OTP, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi để được hỗ trợ.</p>"
                +
                "        <div class='footer'>" +
                "            <p>Trân trọng,<br><strong>Đội ngũ Hỗ trợ HightStarPoolCompany</strong></p>" +
                "            <p><strong>HightStarPoolCompany</strong><br>" +
                "            Email: hightstarpoolcompany@gmail.com | Hotline: 0888-372-325</p>" +
                "            <p>Đây là email tự động từ hệ thống Hight Star. Đây là mail tự động vui lòng không trả lời email này.</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";

        emailService.sendHtmlEmail(to, subject, emailBody);
    }
}
