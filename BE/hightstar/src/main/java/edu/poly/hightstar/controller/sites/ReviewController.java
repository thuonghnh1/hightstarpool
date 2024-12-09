package edu.poly.hightstar.controller.sites;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import edu.poly.hightstar.model.ReviewDTO;
import edu.poly.hightstar.service.CloudinaryService;
import edu.poly.hightstar.service.ReviewService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api") // Đường dẫn công khai cho các phương thức GET
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final CloudinaryService cloudinaryService;

    @GetMapping("/public/reviews/product/{productId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByProductId(@PathVariable Long productId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/public/reviews/course/{courseId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByCourseId(@PathVariable Long courseId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByCourseId(courseId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/public/reviews/trainer/{trainerId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByTrainerId(@PathVariable Long trainerId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByTrainerId(trainerId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/public/reviews")
    public ResponseEntity<List<ReviewDTO>> getAllReviews(
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Long trainerId) {
        List<ReviewDTO> reviews = reviewService.getAllReviews(productId, courseId, trainerId);
        return ResponseEntity.ok(reviews);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER', 'USER')")
    @PostMapping("/user/reviews/addOrUpdate")
    public ResponseEntity<ReviewDTO> addOrUpdateReview(
            @RequestPart("reviewData") String reviewData,
            @RequestPart(value = "images", required = false) List<MultipartFile> files) {

        String publicIds = null;

        try {
            // Chuyển dữ liệu JSON thành ReviewDTO
            ObjectMapper mapper = new ObjectMapper();
            ReviewDTO reviewDTO = mapper.readValue(reviewData, ReviewDTO.class);

            // Lấy review cũ (nếu tồn tại)
            ReviewDTO existingReview = null;
            if (reviewDTO.getReviewId() != null) {
                // Lấy review cũ (nếu tồn tại)
                existingReview = reviewService.getReviewById(reviewDTO.getReviewId());
            }

            // Nếu có ảnh mới
            if (files != null && !files.isEmpty()) {
                // Xóa ảnh cũ (nếu có)
                if (existingReview != null && existingReview.getImages() != null) {
                    for (String imageUrl : existingReview.getImages().split(",")) {
                        handleImageDeletion(extractPublicId(imageUrl));
                    }
                }

                // Upload ảnh mới
                List<String> imageUrls = files.stream()
                        .map(file -> {
                            try {
                                return cloudinaryService.uploadImage(file, "review");
                            } catch (IOException e) {
                                e.printStackTrace();
                                return null;
                            }
                        })
                        .filter(imageUrl -> imageUrl != null)
                        .collect(Collectors.toList());

                // Nối các URL ảnh lại với nhau, phân cách bằng dấu ","
                publicIds = String.join(",", imageUrls);
                reviewDTO.setImages(publicIds);
            } else {
                // Nếu không có ảnh mới, giữ nguyên ảnh cũ
                if (existingReview != null) {
                    reviewDTO.setImages(existingReview.getImages());
                }
            }

            // Tạo hoặc cập nhật đánh giá
            ReviewDTO savedReview = reviewService.addReview(reviewDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);

        } catch (Exception e) {
            // Xử lý lỗi
            e.printStackTrace();
            throw new AppException("Lỗi khi tạo hoặc cập nhật đánh giá: " + e.getMessage(),
                    ErrorCode.UNAUTHORIZED_ACCESS);
        }
    }

    private String extractPublicId(String imageUrl) {
        if (imageUrl != null && imageUrl.contains("/") && imageUrl.contains(".")) {
            int start = imageUrl.lastIndexOf("/") + 1;
            int end = imageUrl.lastIndexOf(".");
            return imageUrl.substring(start, end);
        }
        return null;
    }

    private void handleImageDeletion(String publicId) {
        if (publicId != null) {
            try {
                cloudinaryService.deleteImage(publicId);
            } catch (IOException e) {
                System.err.println("Lỗi khi xóa ảnh: " + e.getMessage());
            }
        }
    }

}
