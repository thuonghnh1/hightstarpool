package edu.poly.hightstar.service;

import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.eclipse.angus.mail.smtp.SMTPAddressFailedException;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        // Kiểm tra định dạng email trước khi gửi
        if (!isValidEmail(to)) {
            throw new AppException("Email không hợp lệ: " + to, ErrorCode.INVALID_EMAIL_FORMAT);
        }

        MimeMessage message = mailSender.createMimeMessage();
        try {
            message.setFrom("hightstarpoolcompany@gmail.com");
            message.setSubject(subject, "UTF-8");
            message.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
            message.setContent(htmlContent, "text/html; charset=utf-8");
            mailSender.send(message);
        } catch (MailSendException ex) {
            Throwable cause = ex.getCause();
            if (cause instanceof SMTPAddressFailedException) {
                throw new AppException("Email không tồn tại hoặc không hợp lệ! " + to, ErrorCode.INVALID_EMAIL);
            }
            throw new AppException("Lỗi không xác định khi gửi email", ErrorCode.EMAIL_SEND_FAILURE);
        } catch (MessagingException e) {
            throw new AppException("Lỗi định dạng hoặc cấu hình email!", ErrorCode.EMAIL_CONFIG_ERROR);
        }
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
        return email != null && email.matches(emailRegex);
    }
}
