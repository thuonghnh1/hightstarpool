package edu.poly.hightstar.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            message.setFrom("hightstarpoolcompany@gmail.com");
            message.setSubject(subject, "UTF-8");
            message.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
            message.setContent(htmlContent, "text/html; charset=utf-8");
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi gửi email. Vui lòng thửi lại sau!");
        }
    }

}
