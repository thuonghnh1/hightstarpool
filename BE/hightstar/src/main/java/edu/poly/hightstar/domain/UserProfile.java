package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

import org.hibernate.annotations.UpdateTimestamp;

@Data
@Entity
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;

    private String fullName;
    private String avatar;
    private String phoneNumber;
    @Temporal(TemporalType.DATE)
    private Date dateOfBirth;
    private boolean gender;
    private String bio;

    // Thời gian cập nhật cuối cùng, tự động cập nhật khi có thay đổi
    @UpdateTimestamp
    private Date updatedAt;

    @OneToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;
}
