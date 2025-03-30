package dev.harshbhargav.backend.movies;

import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/reviews")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService service;

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return new ResponseEntity<>(service.findAllReviews(), HttpStatus.OK);
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<Review> getReview(@PathVariable String reviewId) {
        Optional<Review> review = service.findReviewById(reviewId);
        return review.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/movie/{imdbId}")
    public ResponseEntity<List<Review>> getReviewsByImdbId(@PathVariable String imdbId) {
        List<Review> reviews = service.findReviewsByImdbId(imdbId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @GetMapping("/user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Review>> getReviewsByCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        List<Review> reviews = service.findReviewsByUsername(username);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated() and (hasRole('USER') or hasRole('ADMIN'))")
    public ResponseEntity<Review> createReview(@RequestBody Map<String, String> payload) {
        try {
            String reviewBody = payload.get("reviewBody");
            String imdbId = payload.get("imdbId");

            // Validate rating
            int rating;
            try {
                rating = Integer.parseInt(payload.get("rating"));
                if (rating < 1 || rating > 5) {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            } catch (NumberFormatException e) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            // Validate required fields
            if (reviewBody == null || imdbId == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            // Get the current authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            Review review = service.createReview(reviewBody, imdbId, rating, username);
            return new ResponseEntity<>(review, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error creating review: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Review> updateReview(@PathVariable String reviewId, @RequestBody Map<String, String> payload) {
        try {
            String reviewBody = payload.get("reviewBody");

            // Validate rating
            int rating;
            try {
                rating = Integer.parseInt(payload.get("rating"));
                if (rating < 1 || rating > 5) {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            } catch (NumberFormatException e) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            // Validate required fields
            if (reviewBody == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            // Get the current authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            // Update the review (service will check if user owns this review)
            Review updatedReview = service.updateReview(reviewId, reviewBody, rating, username);
            return new ResponseEntity<>(updatedReview, HttpStatus.OK);
        } catch (Exception e) {
            if (e instanceof org.springframework.security.access.AccessDeniedException) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            System.err.println("Error updating review: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteReview(@PathVariable String reviewId) {
        try {
            // Get the current authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            // Delete the review (service will check if user owns this review)
            service.deleteReview(reviewId, username);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            if (e instanceof org.springframework.security.access.AccessDeniedException) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            System.err.println("Error deleting review: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}