import React from "react";
import "./Hero.css";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlay,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const Hero = ({ movies }) => {
  const navigate = useNavigate();
  const moviesWithBackdrops = movies?.filter((movie) => movie?.backdrops?.[0]);
  function reviews(movieId) {
    navigate(`/Reviews/${movieId}`);
  }

  return (
    <>
      <div className="movie-carousel-container">
        <Carousel
          navButtonsAlwaysVisible={true}
          animation="slide"
          NavButton={({ onClick, className, style, next, prev }) => {
            return (
              <button
                onClick={onClick}
                className={`carousel-nav-button ${className}`}
                style={{
                  ...style,
                  backgroundColor: "transparent",
                  border: "none",
                }}
              >
                <FontAwesomeIcon
                  icon={next ? faChevronRight : faChevronLeft}
                  className="nav-icon text-white"
                  size="2x"
                />
              </button>
            );
          }}
        >
          {moviesWithBackdrops?.map((movie) =>
            movie?.backdrops?.[0] ? (
              <Paper key={movie.imdbId}>
                <div className="movie-card-container">
                  <div
                    className="movie-card"
                    style={{ "--img": `url(${movie.backdrops[0]})` }}
                  >
                    <div className="movie-detail">
                      <div className="movie-poster">
                        <img src={movie.poster} alt={movie.title} />
                      </div>
                      <div className="movie-title">
                        <h4 className="text-white text-xl font-semibold">
                          {movie.title}
                        </h4>
                      </div>
                      <div className="movie-buttons-container flex items-center gap-4 mt-2">
                        {movie.trailerLink && (
                          <Link
                            to={`/Trailer/${movie.trailerLink.substring(
                              movie.trailerLink.length - 11
                            )}`}
                          >
                            <div className="play-button-icon-container text-yellow-400">
                              <FontAwesomeIcon
                                className="play-button-icon"
                                icon={faCirclePlay}
                                size="2x"
                              />
                            </div>
                          </Link>
                        )}
                        <div className="movie-review-button-container">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded"
                            onClick={() => reviews(movie.imdbId)}
                          >
                            Reviews
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Paper>
            ) : null
          )}
        </Carousel>
      </div>

      {/* Grid section using Tailwind */}
      <div className="movie-grid-section max-w-screen-xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {movies?.map((movie) => (
            <div
              key={movie.imdbId}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-auto object-cover"
                />
                <Link
                  to={`/Trailer/${movie.trailerLink.substring(
                    movie.trailerLink.length - 11
                  )}`}
                  className="absolute inset-0 flex items-center justify-center hover:bg-black/40 transition duration-200"
                >
                  <FontAwesomeIcon
                    icon={faCirclePlay}
                    className="text-yellow-400"
                    size="3x"
                  />
                </Link>
              </div>
              <div className="p-4">
                <h5 className="text-white font-semibold text-lg mb-2">
                  {movie.title}
                </h5>
                <button
                  className="w-full border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold py-1 px-4 rounded transition"
                  onClick={() => reviews(movie.imdbId)}
                >
                  Reviews
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;
