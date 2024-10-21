package edu.poly.hightstar.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    //nghi
    Optional<User> findByUsername(String username); // Tìm người dùng theo tên đăng nhập
    Optional<User> findByEmail(String email); // Tìm người dùng theo email
    //nghi
    
}
