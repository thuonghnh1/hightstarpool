package edu.poly.hightstar.repository;

import java.util.List;
import java.util.Optional;

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

    // Tìm review theo userId và trainerId
    Optional<Review> findByUser_UserIdAndTrainer_TrainerId(Long userId, Long trainerId);

    // Tìm review theo userId và productId
    Optional<Review> findByUser_UserIdAndProduct_ProductId(Long userId, Long productId);

    // Tìm review theo userId và courseId
    Optional<Review> findByUser_UserIdAndCourse_CourseId(Long userId, Long courseId);
}
