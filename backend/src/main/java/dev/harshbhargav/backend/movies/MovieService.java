package dev.harshbhargav.backend.movies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovieService {

    @Autowired
    private MovieRepository repository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Movie> findAllMovies() {
        System.out.println("findAllMovies");
        return repository.findAll();
    }

    public Optional<Movie> findMovieByImdbId(String imdbId) {
        return repository.findMovieByImdbId(imdbId);
    }

    public List<Movie> findMoviesWithReviews() {
        // Find all movies that have at least one review
        return repository.findAll().stream()
                .filter(movie -> movie.getReviews() != null && !movie.getReviews().isEmpty())
                .collect(Collectors.toList());
    }

    // Admin functions
    public Movie addMovie(Movie movie) {
        // Check if movie with same imdbId already exists
        Optional<Movie> existingMovie = repository.findMovieByImdbId(movie.getImdbId());
        if (existingMovie.isPresent()) {
            throw new RuntimeException("Movie with IMDB ID " + movie.getImdbId() + " already exists");
        }
        return repository.save(movie);
    }

    public Movie updateMovie(String imdbId, Movie movie) {
        Movie existingMovie = repository.findMovieByImdbId(imdbId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        // Update fields
        existingMovie.setTitle(movie.getTitle());
        existingMovie.setReleaseDate(movie.getReleaseDate());
        existingMovie.setTrailerLink(movie.getTrailerLink());
        existingMovie.setPoster(movie.getPoster());
        existingMovie.setBackdrops(movie.getBackdrops());
        existingMovie.setGenres(movie.getGenres());

        return repository.save(existingMovie);
    }

    public void deleteMovie(String imdbId) {
        Movie movie = repository.findMovieByImdbId(imdbId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        repository.delete(movie);
    }
}