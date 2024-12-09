package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;

    @Column(length = 100) // Giới hạn chiều dài của fullName là 100 ký tự trong database
    private String fullName;

    @Column(length = 255) // Giới hạn chiều dài của avatar là 255 ký tự trong database
    private String avatar;

    @Column(length = 15) // Giới hạn số ký tự của phoneNumber là 15
    private String phoneNumber;

    @Temporal(TemporalType.DATE)
    private Date dateOfBirth;

    @Column(nullable = true)
    private Boolean gender;

    @Column(length = 600) // Giới hạn chiều dài của bio là 600 ký tự
    private String bio;

    @UpdateTimestamp // Thời gian cập nhật cuối cùng, tự động cập nhật khi có thay đổi
    private LocalDateTime updatedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;
}
