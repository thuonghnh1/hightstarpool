package edu.poly.hightstar.controller.sites;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.poly.hightstar.enums.RecipientType;
import edu.poly.hightstar.model.NotificationDTO;
import edu.poly.hightstar.service.NotificationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user/notification")
@RequiredArgsConstructor
public class ShowNotificationController {
    private final NotificationService notificationService;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER', 'USER')")
    @GetMapping
    public List<NotificationDTO> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER', 'USER')")
    @GetMapping("/{id}")
    public NotificationDTO getNotification(@PathVariable Long id) {
        return notificationService.getNotificationById(id);
    }

    @GetMapping("/by-recipient-type/{recipientType}")
    public List<NotificationDTO> getNotificationsByRecipientType(
            @PathVariable("recipientType") RecipientType recipientType) {
        return notificationService.getNotificationsByRecipientType(recipientType);

    }
}
