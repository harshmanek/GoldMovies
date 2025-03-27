package dev.harshbhargav.backend.movies;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/reviews")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService service;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewResponse> createReview(@RequestBody Map<String, String> payload) {
        try {
            String reviewBody = payload.get("reviewBody");
            String imdbId = payload.get("imdbId");
            int rating = Integer.parseInt(payload.get("rating"));

            if (reviewBody == null || imdbId == null || rating < 1 || rating > 5) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            // Get the current authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            Review review = service.createReview(reviewBody, imdbId, rating, username);
            return new ResponseEntity<>(new ReviewResponse(review), HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error creating review: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Rest of the controller remains the same
    // ...
}