package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.Review;
import edu.poly.hightstar.model.ReviewDTO;
import edu.poly.hightstar.repository.ReviewRepository;
import edu.poly.hightstar.service.ReviewService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @Override
    public List<ReviewDTO> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        List<ReviewDTO> reviewDTOs = new ArrayList<>();

        for (Review review : reviews) {
            ReviewDTO dto = convertToDTO(review);
            reviewDTOs.add(dto);
        }

        return reviewDTOs;
    }

    @Override
    public ReviewDTO getReviewById(Long id) {
        Optional<Review> review = reviewRepository.findById(id);
        return review.map(this::convertToDTO).orElse(null);
    }

    private ReviewDTO convertToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        BeanUtils.copyProperties(review, dto);

        // Manually set the IDs of associated entities
        if (review.getProduct() != null) {
            dto.setProductId(review.getProduct().getProductId());
        }
        if (review.getCourse() != null) {
            dto.setCourseId(review.getCourse().getCourseId());
        }
        if (review.getTrainer() != null) {
            dto.setTrainerId(review.getTrainer().getTrainerId());
        }
        if (review.getUser() != null) {
            dto.setUserId(review.getUser().getUserId());
        }
        return dto;
    }

    @Override
    public ReviewDTO createReview(ReviewDTO reviewDTO) {
        Review review = new Review();
        BeanUtils.copyProperties(reviewDTO, review);
        Review createdReview = reviewRepository.save(review);

        ReviewDTO createdReviewDTO = new ReviewDTO();
        BeanUtils.copyProperties(createdReview, createdReviewDTO);
        return createdReviewDTO;
    }

    @Override
    public ReviewDTO updateReview(Long id, ReviewDTO reviewDTO) {
        Optional<Review> reviewOptional = reviewRepository.findById(id);
        if (reviewOptional.isPresent()) {
            Review reviewDetails = reviewOptional.get();
            BeanUtils.copyProperties(reviewDTO, reviewDetails);
            Review updatedReview = reviewRepository.save(reviewDetails);

            ReviewDTO updatedReviewDTO = new ReviewDTO();
            BeanUtils.copyProperties(updatedReview, updatedReviewDTO);
            return updatedReviewDTO;
        }
        return null;
    }

    @Override
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
