package dev.harshbhargav.backend.movies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {
    @Autowired
    private ReviewService service;

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@RequestBody Map<String, String> payload) {
        try {
            String reviewBody = payload.get("reviewBody");
            String imdbId = payload.get("imdbId");
            int rating = Integer.parseInt(payload.get("rating"));

            if (reviewBody == null || imdbId == null || rating < 1 || rating > 5) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Review review = service.createReview(reviewBody, imdbId, rating);
            return new ResponseEntity<>(new ReviewResponse(review), HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error creating review: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable String reviewId,
            @RequestBody Map<String, String> payload) {
        try {
            String reviewBody = payload.get("reviewBody");
            int rating = Integer.parseInt(payload.get("rating"));

            if (reviewBody == null || rating < 1 || rating > 5) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Review updatedReview = service.updateReview(reviewId, reviewBody, rating);
            return new ResponseEntity<>(new ReviewResponse(updatedReview), HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error updating review: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable String reviewId) {
        try {
            service.deleteReview(reviewId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.err.println("Error deleting review: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/movies/{imdbId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByImdbId(@PathVariable String imdbId) {
        try {
            List<Review> reviews = service.getReviewsByImdbId(imdbId);
            List<ReviewResponse> reviewResponses = reviews.stream()
                    .map(ReviewResponse::fromReview)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(reviewResponses, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error fetching reviews: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/movies/{imdbId}/average-rating")
    public ResponseEntity<Double> getAverageRating(@PathVariable String imdbId) {
        try {
            double averageRating = service.getAverageRating(imdbId);
            return new ResponseEntity<>(averageRating, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error calculating average rating: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
