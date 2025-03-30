package dev.harshbhargav.backend.movies;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, ObjectId> {
    // Add a method to find reviews by imdbId
    List<Review> findByImdbId(String imdbId);

    List<Review> findByUsername(String username);
}