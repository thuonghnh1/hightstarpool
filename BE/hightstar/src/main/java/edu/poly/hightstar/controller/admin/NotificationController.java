package edu.poly.hightstar.controller.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.poly.hightstar.model.NotificationDTO;
import edu.poly.hightstar.service.NotificationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/notification")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationDTO> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    @GetMapping("/{id}")
    public NotificationDTO getNotification(@PathVariable Long id) {
        return notificationService.getNotificationById(id);
    }

    @PostMapping
    public ResponseEntity<NotificationDTO> createDiscount(@RequestBody NotificationDTO notificationDTO) {
        NotificationDTO createdNotification = notificationService.createNotification(notificationDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNotification);
    }

    @PutMapping("/{id}")
    public NotificationDTO updateNotification(@PathVariable Long id, @RequestBody NotificationDTO notificationDTO) {
        return notificationService.updateNotification(id, notificationDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok("Xóa giảm giá thành công!");
    }
}
