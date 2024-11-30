package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;
    @Column(length = 255)
    private String content;
    @Column(nullable = false)
    private Boolean status; // đã đọc, chưa đọc
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    @Column(length = 50)
    private String recipientType; // ALL, ADMIN, EMPLOYEE,TRAINER, USER

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;
}
