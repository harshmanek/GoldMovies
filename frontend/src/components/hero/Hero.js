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
import Button from "react-bootstrap/Button";
import { Container, Row, Col, Card } from "react-bootstrap";

const Hero = ({ movies }) => {
  const navigate = useNavigate();

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
              <Button
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
                  className="nav-icon"
                  size="2x"
                />
              </Button>
            );
          }}
        >
          {movies?.map((movie) => {
            return movie?.backdrops?.[0] ? (
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
                        <h4>{movie.title}</h4>
                      </div>
                      <div className="movie-buttons-container">
                        {movie.trailerLink && (
                          <Link
                            to={`/Trailer/${movie.trailerLink.substring(
                              movie.trailerLink.length - 11
                            )}`}
                          >
                            <div className="play-button-icon-container">
                              <FontAwesomeIcon
                                className="play-button-icon"
                                icon={faCirclePlay}
                              />
                            </div>
                          </Link>
                        )}
                        <div className="movie-review-button-container">
                          <Button
                            variant="info"
                            onClick={() => reviews(movie.imdbId)}
                          >
                            Reviews
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Paper>
            ) : null;
          })}
        </Carousel>
      </div>

      <Container className="movie-grid-section">
        <Row xs={1} sm={2} md={4} className="g-4">
          {movies?.map((movie) => (
            <Col key={movie.imdbId}>
              <Card className="movie-grid-card">
                <div className="card-img-container position-relative">
                  <Card.Img
                    variant="top"
                    src={movie.poster}
                    alt={movie.title}
                    className="movie-grid-poster"
                  />
                  <Link
                    to={`/Trailer/${movie.trailerLink.substring(
                      movie.trailerLink.length - 11
                    )}`}
                    className="play-button-overlay"
                  >
                    <FontAwesomeIcon
                      className="play-button-icon"
                      icon={faCirclePlay}
                      size="3x"
                    />
                  </Link>
                </div>
                <Card.Body>
                  <Card.Title className="movie-grid-title">
                    {movie.title}
                  </Card.Title>
                  <Button
                    variant="outline-light"
                    onClick={() => reviews(movie.imdbId)}
                    className="w-100"
                  >
                    Reviews
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Hero;
