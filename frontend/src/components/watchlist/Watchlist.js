import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import api from "../../api/axiosConfig";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./Watchlist.css";

const Watchlist = () => {
  const navigate = useNavigate();
  const [reviewedMovies, setReviewedMovies] = useState([]);

  useEffect(() => {
    getReviewedMovies();
  }, []);

  const getReviewedMovies = async () => {
    try {
      const response = await api.get("/api/v1/movies/reviewed");
      setReviewedMovies(response.data);
    } catch (error) {
      console.error("Error fetching reviewed movies:", error);
    }
  };

  return (
    <Container className="watchlist-container">
      <Row>
        <Col>
          <div className="d-flex align-items-center mb-4">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="back-button me-3"
              onClick={() => navigate("/")}
            />
            <h2 className="text-white m-0">My Watched Movies</h2>
          </div>
        </Col>
      </Row>
      <Row className="g-4">
        {reviewedMovies.map((movie) => (
          <Col key={movie.imdbId} xs={12} sm={6} md={3}>
            <Card className="h-100 movie-card">
              <div className="movie-poster-container">
                <Card.Img
                  variant="top"
                  src={movie.poster}
                  alt={movie.title}
                  className="movie-poster"
                />
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-center movie-title">
                  {movie.title}
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Watchlist;
