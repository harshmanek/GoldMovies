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
import java.util.Optional;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Review> findAllReviews() {
        System.out.println("findAllReviews");
        return reviewRepository.findAll();
    }

    public Optional<Review> findReviewById(String reviewId) {
        try {
            // Convert the reviewId to ObjectId
            Optional<Review> foundReview = reviewRepository.findById(new ObjectId(reviewId));
            System.out.println("findReviewById: " + foundReview);
            return foundReview;
        } catch (IllegalArgumentException e) {
            // Handle the case when reviewId is not a valid ObjectId
            System.out.println("Invalid reviewId format: " + reviewId);
            return Optional.empty();
        }
    }

    public List<Review> findReviewsByImdbId(String imdbId) {
        Movie movie = mongoTemplate.findOne(Query.query(Criteria.where("imdbId").is(imdbId)), Movie.class);

        if (movie != null && movie.getReviews() != null) {
            List<Review> reviews = movie.getReviews();
            System.out.println("findReviewsByImdbId: " + reviews);
            return reviews;
        }

        return List.of();
    }

    public List<Review> findReviewsByUsername(String username) {
        return reviewRepository.findByUsername(username);
    }

    public double getAverageRating(String imdbId) {
        List<Review> reviews = findReviewsByImdbId(imdbId);
        if (reviews.isEmpty()) {
            return 0.0;
        }

        double totalRating = reviews.stream().mapToInt(Review::getRating).sum();

        return totalRating / reviews.size();
    }

    public Review createReview(String reviewBody, String imdbId, int rating, String username) {
        Review review = new Review();
        review.setBody(reviewBody);
        review.setRating(rating);
        review.setCreated(LocalDateTime.now());
        review.setUpdated(LocalDateTime.now());
        review.setImdbId(imdbId);
        review.setUsername(username);

        Review savedReview = reviewRepository.insert(review);

        mongoTemplate.update(Movie.class).matching(Query.query(Criteria.where("imdbId").is(imdbId))).apply(new Update().push("reviews").value(savedReview)).first();
        System.out.println("Review id: " + savedReview.getId());
        System.out.println("Review body:" + savedReview.getBody());
        System.out.println("Review rating: " + savedReview.getRating());
        System.out.println("Review created by user: " + savedReview.getUsername());
        System.out.println("Review created at: " + savedReview.getCreated());
        System.out.println("Review updated at: " + savedReview.getUpdated());
        System.out.println("Review created: " + savedReview.getImdbId());
        return savedReview;
    }

    public Review updateReview(String reviewId, String reviewBody, int rating, String username) {
        Review review = reviewRepository.findById(new ObjectId(reviewId)).orElseThrow(() -> new RuntimeException("Review not found"));

        // Check if the user is the owner of the review
        if (!review.getUsername().equals(username)) {
            throw new AccessDeniedException("You can only update your own reviews");
        }

        // Update the review document
        review.setBody(reviewBody);
        review.setRating(rating);
        review.setUpdated(LocalDateTime.now());
        Review updatedReview = reviewRepository.save(review);

        // Update the embedded review in the movie document
        Movie movie = mongoTemplate.findOne(Query.query(Criteria.where("imdbId").is(review.getImdbId())), Movie.class);

        if (movie != null && movie.getReviews() != null) {
            List<Review> reviews = movie.getReviews();
            for (int i = 0; i < reviews.size(); i++) {
                if (reviews.get(i).getId().equals(new ObjectId(reviewId))) {
                    reviews.set(i, updatedReview);
                    break;
                }
            }

            mongoTemplate.save(movie);
        }
        System.out.println("Review updated: " + updatedReview);
        return updatedReview;
    }

    public void deleteReview(String reviewId, String username) {
        Review review = reviewRepository.findById(new ObjectId(reviewId)).orElseThrow(() -> new RuntimeException("Review not found"));

        // Check if the user is the owner of the review
        if (!review.getUsername().equals(username)) {
            throw new AccessDeniedException("You can only delete your own reviews");
        }

        // Remove review from movie document
        mongoTemplate.updateFirst(Query.query(Criteria.where("imdbId").is(review.getImdbId())), new Update().pull("reviews", Query.query(Criteria.where("_id").is(new ObjectId(reviewId)))), Movie.class);

        // Delete the review
        reviewRepository.deleteById(new ObjectId(reviewId));
        System.out.println("Review deleted: " + reviewId);
    }
}