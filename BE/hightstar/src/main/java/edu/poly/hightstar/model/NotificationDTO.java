package edu.poly.hightstar.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import edu.poly.hightstar.enums.RecipientType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDTO {
    @JsonProperty("id") // ID thông báo
    private Long notificationId;
    private String content;
    private Boolean status;
    private LocalDateTime createdAt;
    private RecipientType recipientType;
    private Long userId;
}
