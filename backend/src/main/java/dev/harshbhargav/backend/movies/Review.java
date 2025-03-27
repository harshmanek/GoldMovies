package dev.harshbhargav.backend.movies;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "reviews")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Review {
    @Id
    private ObjectId id;
    private String body;
    private LocalDateTime created;
    private LocalDateTime updated;
    private String imdbId;
    private int rating;
    private String username; // Add this field to track which user created the review

    // Constructor for creating a new review
    public Review(String body, int rating, String username) {
        this.body = body;
        this.rating = rating;
        this.username = username;
        this.created = LocalDateTime.now();
        this.updated = LocalDateTime.now();
    }

    // Update existing constructor
    public Review(String body, LocalDateTime created, LocalDateTime updated, String imdbId, int rating) {
        this.body = body;
        this.created = created;
        this.updated = updated;
        this.imdbId = imdbId;
        this.rating = rating;
    }

    // Update constructor with username
    public Review(String body, LocalDateTime created, LocalDateTime updated, String imdbId, int rating, String username) {
        this.body = body;
        this.created = created;
        this.updated = updated;
        this.imdbId = imdbId;
        this.rating = rating;
        this.username = username;
    }

    // Existing getters and setters
    // ...
}