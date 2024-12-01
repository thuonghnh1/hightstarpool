package edu.poly.hightstar.controller.sites;

import edu.poly.hightstar.model.ReviewDTO;
import edu.poly.hightstar.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER', 'USER')")
    @PostMapping("/addOrUpdate")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewDTO addOrUpdateReview(@RequestBody ReviewDTO reviewDTO) {
        return reviewService.addReview(reviewDTO);
    }
}
