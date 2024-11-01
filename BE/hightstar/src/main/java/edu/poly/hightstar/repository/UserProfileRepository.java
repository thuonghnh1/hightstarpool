package edu.poly.hightstar.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.UserProfile;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByUser_UserId(Long userId);

    void deleteByUser_UserId(Long userId);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByPhoneNumberAndUserUserIdNot(String phoneNumber, Long userId); // không tính userId đang cập nhật

}
