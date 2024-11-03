package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import edu.poly.hightstar.enums.Role;
import edu.poly.hightstar.enums.UserStatus;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    // username sẽ là email hoặc sđt
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, length = 80)
    private String password;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // Chỉ định thời gian khi bản ghi được tạo. Thời gian này không bao giờ thay đổi
    // sau khi entity được tạo.
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime registeredDate;

    // Thời gian cập nhật cuối cùng, tự động cập nhật khi có thay đổi
    @UpdateTimestamp
    private LocalDateTime lastLogin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.ACTIVE; // Mặc định là hoạt động

    // Liên kết với UserProfile, kèm theo Cascade và Orphan Removal để tự động xóa
    // UserProfile khi xóa User
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private UserProfile userProfile;

    // Liên kết Trainer, sẽ tự động xóa khi User bị xóa
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Trainer trainer;
}
