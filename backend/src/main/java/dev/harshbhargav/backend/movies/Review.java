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

    // Constructor for creating a new review
    public Review(String body, int rating) {
        this.body = body;
        this.rating = rating;
        this.created = LocalDateTime.now();
        this.updated = LocalDateTime.now();
    }

    // Constructor with all fields except id
    public Review(String body, LocalDateTime created, LocalDateTime updated, String imdbId, int rating) {
        this.body = body;
        this.created = created;
        this.updated = updated;
        this.imdbId = imdbId;
        this.rating = rating;
    }

    // Getter for id that returns String representation
    public String getId() {
        return id != null ? id.toString() : null;
    }

    // Setter for imdbId
    public void setImdbId(String imdbId) {
        this.imdbId = imdbId;
    }

    // Getter for imdbId
    public String getImdbId() {
        return imdbId;
    }

    // Rating getter and setter (although @Data provides these, explicit ones can be useful)
    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
        this.updated = LocalDateTime.now(); // Update the updated timestamp when rating changes
    }
}