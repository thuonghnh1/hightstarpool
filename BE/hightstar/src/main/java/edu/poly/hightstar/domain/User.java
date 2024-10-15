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
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    // username sẽ là email hoặc sđt
    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
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
}
