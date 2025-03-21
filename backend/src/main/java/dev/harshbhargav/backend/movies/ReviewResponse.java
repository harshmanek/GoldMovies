package dev.harshbhargav.backend.movies;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private String id;
    private String body;
    private int rating;
    private LocalDateTime created;
    private LocalDateTime updated;
    private String imdbId;

    // Constructor to convert Review entity to DTO
    public ReviewResponse(Review review) {
        this.id = String.valueOf(review.getId());
        this.body = review.getBody();
        this.rating = review.getRating();
        this.created = review.getCreated();
        this.updated = review.getUpdated();
        this.imdbId = review.getImdbId();
    }

    // Static method to convert Review to ReviewResponse
    public static ReviewResponse fromReview(Review review) {
        return new ReviewResponse(review);
    }
}