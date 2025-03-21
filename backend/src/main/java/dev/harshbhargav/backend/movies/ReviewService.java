package dev.harshbhargav.backend.movies;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public Review createReview(String reviewBody, String imdbId, int rating) {
        Review review = new Review();
        review.setBody(reviewBody);
        review.setRating(rating);
        review.setCreated(LocalDateTime.now());
        review.setImdbId(imdbId);

        Review savedReview = reviewRepository.insert(review);

        mongoTemplate.update(Movie.class)
                .matching(Query.query(Criteria.where("imdbId").is(imdbId)))
                .apply(new Update().push("reviews").value(savedReview))
                .first();

        return savedReview;
    }



    public void deleteReview(String reviewId) {
        Review review = reviewRepository.findById(new ObjectId(reviewId))
                .orElseThrow(() -> new RuntimeException("Review not found"));

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

    public List<Review> getReviewsByImdbId(String imdbId) {
        Movie movie = mongoTemplate.findOne(
                Query.query(Criteria.where("imdbId").is(imdbId)),
                Movie.class);

        if (movie != null && movie.getReviews() != null) {
            return movie.getReviews();
        }

        return List.of();
    }

    public double getAverageRating(String imdbId) {
        List<Review> reviews = getReviewsByImdbId(imdbId);
        if (reviews.isEmpty()) {
            return 0.0;
        }

        double totalRating = reviews.stream()
                .mapToInt(Review::getRating)
                .sum();

        return totalRating / reviews.size();
    }

    public Review updateReview(String reviewId, String reviewBody, int rating) {
        Review review = reviewRepository.findById(new ObjectId(reviewId))
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Update the review document
        review.setBody(reviewBody);
        review.setRating(rating);
        review.setUpdated(LocalDateTime.now());
        Review updatedReview = reviewRepository.save(review);

        // Update the embedded review in the movie document
        Movie movie = mongoTemplate.findOne(
                Query.query(Criteria.where("imdbId").is(review.getImdbId())),
                Movie.class
        );

        if (movie != null && movie.getReviews() != null) {
            List<Review> reviews = movie.getReviews();
            for (int i = 0; i < reviews.size(); i++) {
                if (reviews.get(i).getId().equals(reviewId)) {
                    reviews.set(i, updatedReview);
                    break;
                }
            }

            mongoTemplate.save(movie);
        }

        return updatedReview;
    }

}