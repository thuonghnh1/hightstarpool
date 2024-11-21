package edu.poly.hightstar.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {
    @JsonProperty("id")
    private Long reviewId;
    private int rating;
    private String comment;
    private String image;
    private LocalDateTime createdAt;
    private Long productId;
    private Long courseId;
    private Long trainerId;
    private Long userId;

}
