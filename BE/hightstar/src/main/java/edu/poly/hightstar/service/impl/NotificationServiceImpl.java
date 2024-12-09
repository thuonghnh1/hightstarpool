package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.Notification;
import edu.poly.hightstar.domain.User;
import edu.poly.hightstar.enums.RecipientType;
import edu.poly.hightstar.model.NotificationDTO;
import edu.poly.hightstar.repository.NotificationRepository;
import edu.poly.hightstar.repository.UserRepository;
import edu.poly.hightstar.service.NotificationService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public List<NotificationDTO> getAllNotifications() {
        try {
            return notificationRepository.findAll().stream().map(notification -> {
                return convertToNotificationDTO(notification);
            }).collect(Collectors.toList());
        } catch (Exception e) {
            // Log lỗi để kiểm tra nguyên nhân
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi lấy thông báo.");
        }
    }

    @Override
    public NotificationDTO getNotificationById(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new AppException("Thông báo này không tồn tại!", ErrorCode.NOTIFICATION_NOT_FOUND));

        NotificationDTO notificationDTO = new NotificationDTO();
        BeanUtils.copyProperties(notification, notificationDTO);
        return notificationDTO;
    }

    @Override
    public List<NotificationDTO> getNotificationsByRecipientType(RecipientType recipientType) {
        try {
            return notificationRepository.findByRecipientType(recipientType).stream().map(notification -> {
                return convertToNotificationDTO(notification);
            }).collect(Collectors.toList());
        } catch (Exception e) {
            // Log lỗi để kiểm tra nguyên nhân
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi lấy thông báo.");
        }
    }

    @Override
    public NotificationDTO createNotification(NotificationDTO notificationDTO) {
        // Tạo Notification từ NotificationDTO
        Notification notification = convertToNotification(notificationDTO);
        if (notificationDTO.getRecipientType() != RecipientType.ALL) {
            notification.setStatus(true);
        }
        // Lưu Notification và chuyển đổi lại thành DTO
        Notification createdNotification = notificationRepository.save(notification);
        return convertToNotificationDTO(createdNotification);
    }

    @Override
    public NotificationDTO updateNotification(Long id, NotificationDTO notificationDTO) {
        // Tìm thông báo hiện tại từ DB
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new AppException("Thông báo này không tồn tại!", ErrorCode.NOTIFICATION_NOT_FOUND));

        // Cập nhật thông báo từ NotificationDTO
        BeanUtils.copyProperties(notificationDTO, notification);

        // Lưu lại thông báo đã cập nhật và chuyển đổi lại thành DTO
        Notification updatedNotification = notificationRepository.save(notification);
        return convertToNotificationDTO(updatedNotification);
    }

    // Phương thức chuyển NotificationDTO sang Notification và kiểm tra UserId
    private Notification convertToNotification(NotificationDTO notificationDTO) {
        Notification notification = new Notification();
        BeanUtils.copyProperties(notificationDTO, notification);

        // Kiểm tra UserId và ánh xạ User nếu có
        if (notificationDTO.getUserId() != null) {
            User user = userRepository.findById(notificationDTO.getUserId())
                    .orElseThrow(() -> new AppException("Không tìm thấy người dùng này trong hệ thống!",
                            ErrorCode.USER_NOT_FOUND));
            notification.setUser(user);
        }
        return notification;
    }

    // Phương thức chuyển Notification sang NotificationDTO
    private NotificationDTO convertToNotificationDTO(Notification notification) {
        NotificationDTO notificationDTO = new NotificationDTO();
        BeanUtils.copyProperties(notification, notificationDTO);
        if (notification.getUser() != null) {
            notificationDTO.setUserId(notification.getUser().getUserId());
        }
        return notificationDTO;
    }

    @Override
    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new AppException("Thông báo này không tồn tại!", ErrorCode.NOTIFICATION_NOT_FOUND);
        }
        notificationRepository.deleteById(id);
    }
}
