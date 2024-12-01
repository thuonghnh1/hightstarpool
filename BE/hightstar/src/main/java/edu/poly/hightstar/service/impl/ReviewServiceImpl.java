package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.Review;
import edu.poly.hightstar.domain.Course;
import edu.poly.hightstar.domain.Product;
import edu.poly.hightstar.domain.Trainer;
import edu.poly.hightstar.domain.User;  // Import User
import edu.poly.hightstar.model.ReviewDTO;
import edu.poly.hightstar.repository.ReviewRepository;
import edu.poly.hightstar.repository.CourseRepository;
import edu.poly.hightstar.repository.ProductRepository;
import edu.poly.hightstar.repository.TrainerRepository;
import edu.poly.hightstar.repository.UserRepository;
import edu.poly.hightstar.service.ReviewService;
import edu.poly.hightstar.service.TrainerService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final TrainerRepository trainerRepository;
    private final CourseRepository courseRepository;
    private final ProductRepository productRepository;
    private final TrainerService trainerService;
    private final UserRepository userRepository;  // Inject UserService

    @Override
    @Transactional
    public ReviewDTO addReview(ReviewDTO reviewDTO) {

        // Kiểm tra xem ít nhất một trong ba trường trainerId, productId, hoặc courseId có giá trị không
        if (reviewDTO.getTrainerId() == null && reviewDTO.getProductId() == null && reviewDTO.getCourseId() == null) {
            throw new AppException("Không có đối tượng đánh giá nào được chọn!", ErrorCode.INVALID_INPUT);
        }

        // Kiểm tra và lấy Trainer, Product, hoặc Course từ cơ sở dữ liệu
        Trainer trainer = null;
        if (reviewDTO.getTrainerId() != null) {
            trainer = trainerRepository.findById(reviewDTO.getTrainerId()).orElseThrow(()
                    -> new AppException("Không tìm thấy huấn luyện viên với id là: " + reviewDTO.getTrainerId(), ErrorCode.TRAINER_NOT_FOUND));
        }

        Product product = null;
        if (reviewDTO.getProductId() != null) {
            product = productRepository.findById(reviewDTO.getProductId()).orElseThrow(()
                    -> new AppException("Không tìm thấy sản phẩm với id là: " + reviewDTO.getProductId(), ErrorCode.PRODUCT_NOT_FOUND));
        }

        Course course = null;
        if (reviewDTO.getCourseId() != null) {
            course = courseRepository.findById(reviewDTO.getCourseId()).orElseThrow(()
                    -> new AppException("Không tìm thấy khóa học với id là: " + reviewDTO.getCourseId(), ErrorCode.COURSE_NOT_FOUND));
        }

        User user = null;
        if (reviewDTO.getUserId() != null) {
            user = userRepository.findById(reviewDTO.getCourseId()).orElseThrow(()
                    -> new AppException("Không tìm thấy khóa học với id là: " + reviewDTO.getCourseId(), ErrorCode.COURSE_NOT_FOUND));
        }

        // Tạo đối tượng Review từ DTO
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

        // Gán người dùng vào review
        newReview.setUser(user);

        // Lưu review vào cơ sở dữ liệu
        Review savedReview = reviewRepository.save(newReview);

        // Cập nhật lại rating trung bình của huấn luyện viên sau khi thêm review mới
        if (trainer != null) {
            trainerService.updateRating(savedReview.getTrainer().getTrainerId());
        }

        // Chuyển đổi Review thành ReviewDTO để trả về
        ReviewDTO newReviewDTO = new ReviewDTO();
        BeanUtils.copyProperties(savedReview, newReviewDTO);

        return newReviewDTO;
    }
}
