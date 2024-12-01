package edu.poly.hightstar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Lấy tất cả các review của một huấn luyện viên
    List<Review> findByTrainer_TrainerId(Long trainerId);

    // Lấy tất cả các review của 1 course
    List<Review> findByCourse_CourseId(Long courseId);

    // Lấy tất cả các review của 1 product
    List<Review> findByProduct_ProductId(Long productId);
}
