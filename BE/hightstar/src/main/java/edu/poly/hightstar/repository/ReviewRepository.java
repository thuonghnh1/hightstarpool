package edu.poly.hightstar.repository;

import edu.poly.hightstar.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
