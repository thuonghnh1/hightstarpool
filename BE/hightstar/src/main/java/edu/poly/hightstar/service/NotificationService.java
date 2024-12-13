package edu.poly.hightstar.service;

import java.util.List;

import edu.poly.hightstar.enums.RecipientType;
import edu.poly.hightstar.model.NotificationDTO;

public interface NotificationService {

    List<NotificationDTO> getAllNotifications();

    NotificationDTO getNotificationById(Long id);

    List<NotificationDTO> getNotificationsByRecipientType(RecipientType recipientType);

    List<NotificationDTO> getNotificationsByUserId(Long userId);

    NotificationDTO createNotification(NotificationDTO notificationDTO);

    NotificationDTO updateNotification(Long id, NotificationDTO notificationDTO);

    void deleteNotification(Long id);

    boolean updateNotificationStatus(Long notificationId, Boolean status);

}
