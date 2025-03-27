package dev.harshbhargav.backend.movies;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public Review createReview(String reviewBody, String imdbId, int rating, String username) {
        Review review = new Review();
        review.setBody(reviewBody);
        review.setRating(rating);
        review.setCreated(LocalDateTime.now());
        review.setImdbId(imdbId);
        review.setUsername(username);

        Review savedReview = reviewRepository.insert(review);

        mongoTemplate.update(Movie.class)
                .matching(Query.query(Criteria.where("imdbId").is(imdbId)))
                .apply(new Update().push("reviews").value(savedReview))
                .first();

        return savedReview;
    }

    public void deleteReview(String reviewId, String username) {
        Review review = reviewRepository.findById(new ObjectId(reviewId))
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Check if the user is the owner of the review
        if (!review.getUsername().equals(username)) {
            throw new AccessDeniedException("You can only delete your own reviews");
        }

        // Remove review from movie document
        mongoTemplate.updateFirst(
                Query.query(Criteria.where("imdbId").is(review.getImdbId())),
                new Update().pull("reviews",
                        Query.query(Criteria.where("_id").is(new ObjectId(reviewId)))),
                Movie.class
        );

        // Delete the review
        reviewRepository.deleteById(new ObjectId(reviewId));
    }

    // Other methods remain the same
    // ...
}