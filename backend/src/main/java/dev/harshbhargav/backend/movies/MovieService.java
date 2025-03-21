package dev.harshbhargav.backend.movies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovieService {

    @Autowired
    private MovieRepository repository;

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
}
