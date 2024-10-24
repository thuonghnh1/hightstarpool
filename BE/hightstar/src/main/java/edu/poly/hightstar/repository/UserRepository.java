package edu.poly.hightstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
