package edu.poly.hightstar.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.poly.hightstar.domain.Course;
import edu.poly.hightstar.domain.Product; // Import User
import edu.poly.hightstar.domain.Review;
import edu.poly.hightstar.domain.Trainer;
import edu.poly.hightstar.domain.User;
import edu.poly.hightstar.domain.UserProfile;
import edu.poly.hightstar.model.ReviewDTO;
import edu.poly.hightstar.model.UserDTO;
import edu.poly.hightstar.repository.CourseRepository;
import edu.poly.hightstar.repository.ProductRepository;
import edu.poly.hightstar.repository.ReviewRepository;
import edu.poly.hightstar.repository.TrainerRepository;
import edu.poly.hightstar.repository.UserProfileRepository;
import edu.poly.hightstar.service.ReviewService;
import edu.poly.hightstar.service.TrainerService;
import edu.poly.hightstar.service.UserService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final TrainerRepository trainerRepository;
    private final CourseRepository courseRepository;
    private final ProductRepository productRepository;
    private final TrainerService trainerService;
    private final UserService userService;
    private final UserProfileRepository userProfileRepository;

    @Override
    public List<ReviewDTO> getReviewsByTrainerId(Long trainerId) {
        return reviewRepository.findByTrainerId(trainerId);
    }

    @Override
    public List<ReviewDTO> getReviewsByCourseId(Long courseId) {
        return reviewRepository.findByCourseId(courseId);
    }

    @Override
    public List<ReviewDTO> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    @Override
    public ReviewDTO getReviewById(Long reviewId) {
        // Lấy review từ database theo ID, ném ngoại lệ nếu không tìm thấy
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(
                        () -> new AppException("Không tìm thấy đánh giá với ID: " + reviewId,
                                ErrorCode.REVIEW_NOT_FOUND));
        // Chuyển đổi từ entity sang DTO
        return convertToDTO(review);
    }

    @Override
    public List<ReviewDTO> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        return reviews.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ReviewDTO convertToDTO(Review review) {
        return new ReviewDTO(
                review.getReviewId(),
                review.getRating(),
                review.getComment(),
                review.getImages(),
                review.getCreatedAt(),
                review.getProduct() != null ? review.getProduct().getProductId() : null,
                review.getCourse() != null ? review.getCourse().getCourseId() : null,
                review.getTrainer() != null ? review.getTrainer().getTrainerId() : null,
                null, // fullName đã được lấy ở Repository
                null, // avatar đã được lấy ở Repository
                review.getUser() != null ? review.getUser().getUserId() : null);
    }

    @Override
    @Transactional
    public ReviewDTO addReview(ReviewDTO reviewDTO) {

        // Kiểm tra xem ít nhất một trong ba trường trainerId, productId, hoặc courseId
        // có giá trị không
        if (reviewDTO.getTrainerId() == null && reviewDTO.getProductId() == null && reviewDTO.getCourseId() == null) {
            throw new AppException("Không có đối tượng đánh giá nào được chọn!", ErrorCode.INVALID_INPUT);
        }

        // Kiểm tra và lấy Trainer, Product, hoặc Course từ cơ sở dữ liệu
        Trainer trainer = null;
        if (reviewDTO.getTrainerId() != null) {
            trainer = trainerRepository.findById(reviewDTO.getTrainerId())
                    .orElseThrow(() -> new AppException(
                            "Không tìm thấy huấn luyện viên với id là: " + reviewDTO.getTrainerId(),
                            ErrorCode.TRAINER_NOT_FOUND));
        }

        Product product = null;
        if (reviewDTO.getProductId() != null) {
            product = productRepository.findById(reviewDTO.getProductId()).orElseThrow(() -> new AppException(
                    "Không tìm thấy sản phẩm với id là: " + reviewDTO.getProductId(), ErrorCode.PRODUCT_NOT_FOUND));
        }

        Course course = null;
        if (reviewDTO.getCourseId() != null) {
            course = courseRepository.findById(reviewDTO.getCourseId())
                    .orElseThrow(() -> new AppException("Không tìm thấy khóa học với id là: " + reviewDTO.getCourseId(),
                            ErrorCode.COURSE_NOT_FOUND));
        }

        User user = new User();
        UserProfile userProfile = new UserProfile();
        if (reviewDTO.getUserId() != null) {
            // Truy vấn userDTO từ cơ sở dữ liệu
            UserDTO userDTO = userService.getUserById(reviewDTO.getUserId());
            if (userDTO != null && userDTO.getUserId() != null) {
                UserProfile userProfileDTO = userProfileRepository.findByUser_UserId(userDTO.getUserId())
                        .orElseThrow(() -> new AppException("Không tìm thấy hồ sơ của người dùng!",
                                ErrorCode.USER_PROFILE_NOT_FOUND));
                BeanUtils.copyProperties(userProfileDTO, userProfile);
                BeanUtils.copyProperties(userDTO, user);
            } else {
                user = null;
            }
        } else {
            throw new AppException("Vui lòng đăng nhập trước khi đánh giá!", ErrorCode.UNAUTHORIZED_ACCESS);
        }

        // Kiểm tra nếu người dùng đã có đánh giá cho trainer, product, hoặc course
        Review existingReview = null;
        if (reviewDTO.getTrainerId() != null) {
            // Tìm đánh giá của người dùng cho trainer
            existingReview = reviewRepository
                    .findByUser_UserIdAndTrainer_TrainerId(reviewDTO.getUserId(), reviewDTO.getTrainerId())
                    .orElse(null);
        } else if (reviewDTO.getProductId() != null) {
            // Tìm đánh giá của người dùng cho product
            existingReview = reviewRepository
                    .findByUser_UserIdAndProduct_ProductId(reviewDTO.getUserId(), reviewDTO.getProductId())
                    .orElse(null);
        } else if (reviewDTO.getCourseId() != null) {
            // Tìm đánh giá của người dùng cho course
            existingReview = reviewRepository
                    .findByUser_UserIdAndCourse_CourseId(reviewDTO.getUserId(), reviewDTO.getCourseId()).orElse(null);
        }

        // Nếu đã có review, cập nhật lại số sao và nội dung
        if (existingReview != null) {
            existingReview.setRating(reviewDTO.getRating());
            existingReview.setComment(reviewDTO.getComment());
            if (reviewDTO.getImages() != null) {
                existingReview.setImages(reviewDTO.getImages());
            }
            Review updatedReview = reviewRepository.save(existingReview);

            // Cập nhật lại rating trung bình của huấn luyện viên nếu có
            if (trainer != null) {
                trainerService.updateRating(updatedReview.getTrainer().getTrainerId());
            }
            ReviewDTO updatedReviewDTO = new ReviewDTO();
            BeanUtils.copyProperties(updatedReview, updatedReviewDTO);
            // Cập nhật các giá trị đúng trong DTO
            if (updatedReview.getCourse() != null) {
                updatedReviewDTO.setCourseId(updatedReview.getCourse().getCourseId());
            }
            if (updatedReview.getTrainer() != null) {
                updatedReviewDTO.setTrainerId(updatedReview.getTrainer().getTrainerId());
            }
            if (updatedReview.getProduct() != null) {
                updatedReviewDTO.setProductId(updatedReview.getProduct().getProductId());
            }
            updatedReviewDTO.setUserId(updatedReview.getUser().getUserId());
            updatedReviewDTO.setFullName(userProfile.getFullName());
            updatedReviewDTO.setAvatar(userProfile.getAvatar());

            return updatedReviewDTO;
        }

        // Nếu chưa có review, tạo mới review
        Review newReview = new Review();
        BeanUtils.copyProperties(reviewDTO, newReview);

        // Gán trainer, product, hoặc course vào review nếu có
        if (trainer != null) {
            newReview.setTrainer(trainer);
        }
        if (product != null) {
            newReview.setProduct(product);
        }
        if (course != null) {
            newReview.setCourse(course);
        }
        newReview.setUser(user);
        Review savedReview = reviewRepository.save(newReview);

        // Cập nhật lại rating trung bình của huấn luyện viên nếu có
        if (trainer != null) {
            trainerService.updateRating(savedReview.getTrainer().getTrainerId());
        }

        ReviewDTO newReviewDTO = new ReviewDTO();
        BeanUtils.copyProperties(savedReview, newReviewDTO);
        // Cập nhật các giá trị đúng trong DTO
        if (savedReview.getCourse() != null) {
            newReviewDTO.setCourseId(savedReview.getCourse().getCourseId());
        }
        if (savedReview.getTrainer() != null) {
            newReviewDTO.setTrainerId(savedReview.getTrainer().getTrainerId());
        }
        if (savedReview.getProduct() != null) {
            newReviewDTO.setProductId(savedReview.getProduct().getProductId());
        }
        newReviewDTO.setUserId(savedReview.getUser().getUserId());
        newReviewDTO.setFullName(userProfile.getFullName());
        newReviewDTO.setAvatar(userProfile.getAvatar());

        return newReviewDTO;
    }
}
