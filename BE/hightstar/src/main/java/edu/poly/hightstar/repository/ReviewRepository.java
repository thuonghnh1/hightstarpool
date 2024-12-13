package edu.poly.hightstar.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.Review;
import edu.poly.hightstar.model.ReviewDTO;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

        // Lấy tất cả các review của một huấn luyện viên
        @Query("SELECT new edu.poly.hightstar.model.ReviewDTO(r.reviewId, r.rating, r.comment, r.images, r.createdAt, "
                        +
                        "r.product.productId, r.course.courseId, r.trainer.trainerId, up.fullName, up.avatar, u.userId) "
                        +
                        "FROM Review r JOIN r.user u JOIN u.userProfile up " +
                        "WHERE r.trainer.trainerId = :trainerId")
        List<ReviewDTO> findByTrainerId(@Param("trainerId") Long trainerId);

        // Lấy tất cả các review của 1 course
        @Query("SELECT new edu.poly.hightstar.model.ReviewDTO(r.reviewId, r.rating, r.comment, r.images, r.createdAt, "
                        +
                        "r.product.productId, r.course.courseId, r.trainer.trainerId, up.fullName, up.avatar, u.userId) "
                        +
                        "FROM Review r JOIN r.user u JOIN u.userProfile up " +
                        "WHERE r.course.courseId = :courseId")
        List<ReviewDTO> findByCourseId(@Param("courseId") Long courseId);

        // Lấy tất cả các review của một product
        @Query("SELECT new edu.poly.hightstar.model.ReviewDTO(r.reviewId, r.rating, r.comment, r.images, r.createdAt, "
                        +
                        "r.product.productId, r.course.courseId, r.trainer.trainerId, up.fullName, up.avatar, u.userId) "
                        +
                        "FROM Review r JOIN r.user u JOIN u.userProfile up " +
                        "WHERE r.product.productId = :productId")
        List<ReviewDTO> findByProductId(@Param("productId") Long productId);

        // Tìm review theo userId và trainerId
        Optional<Review> findByUser_UserIdAndTrainer_TrainerId(Long userId, Long trainerId);

        // Tìm review theo userId và productId
        Optional<Review> findByUser_UserIdAndProduct_ProductId(Long userId, Long productId);

        // Tìm review theo userId và courseId
        Optional<Review> findByUser_UserIdAndCourse_CourseId(Long userId, Long courseId);
}
