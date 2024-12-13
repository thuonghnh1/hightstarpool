package edu.poly.hightstar.service;

import java.util.List;

import edu.poly.hightstar.model.ReviewDTO;

public interface ReviewService {

    ReviewDTO addReview(ReviewDTO reviewDTO);

    ReviewDTO getReviewById(Long reviewId);

    List<ReviewDTO> getReviewsByProductId(Long productId);

    List<ReviewDTO> getReviewsByCourseId(Long courseId);

    List<ReviewDTO> getReviewsByTrainerId(Long trainerId);

    List<ReviewDTO> getAllReviews();
}
