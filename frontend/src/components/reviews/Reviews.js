import { useEffect, useRef, useState } from "react";
import api from "../../api/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import ReviewForm from "../reviewForm/ReviewForm";
import StarRating from "../starRating/StarRating";
import { FaStar } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./Reviews.css";

import React from "react";

const Reviews = ({ getMovieData, movie, reviews, setReviews }) => {
  const revText = useRef();
  const [rating, setRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);
  let params = useParams();
  const movieId = params.movieId;
  const navigate = useNavigate();

  useEffect(() => {
    getMovieData(movieId);
  }, []);

  const addReview = async (e) => {
    e.preventDefault();
    const rev = revText.current;

    try {
      const response = await api.post("/api/v1/reviews", {
        reviewBody: rev.value,
        imdbId: movieId,
        rating: parseInt(rating),
      });

      // Update the reviews state with the response from the server
      const updatedReviews = [
        ...reviews,
        {
          body: rev.value,
          rating: parseInt(rating),
          created: new Date().toISOString(),
        },
      ];

      rev.value = "";
      setRating(0);
      setReviews(updatedReviews);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditReview = async (index, review) => {
    try {
      // Set the form values for editing
      revText.current.value = review.body;
      setRating(review.rating);
      setEditingReviewId(review.id);
    } catch (err) {
      console.error("Error preparing review edit:", err);
    }
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    const rev = revText.current;

    try {
      const response = await api.put(`/api/v1/reviews/${editingReviewId}`, {
        reviewBody: rev.value,
        rating: parseInt(rating),
      });

      // Update the reviews state with the updated review
      const updatedReviews = reviews.map((r) =>
        r.id === editingReviewId
          ? { ...r, body: rev.value, rating: parseInt(rating) }
          : r
      );

      // Reset form
      rev.value = "";
      setRating(0);
      setEditingReviewId(null);
      setReviews(updatedReviews);
    } catch (err) {
      console.error("Error updating review:", err);
    }
  };

  const handleDeleteReview = async (index, reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        // Delete from database
        await api.delete(`/api/v1/reviews/${reviewId}`);

        // Update local state
        const updatedReviews = reviews.filter((r) => r.id !== reviewId);
        setReviews(updatedReviews);
      } catch (err) {
        console.error("Error deleting review:", err);
      }
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <div className="d-flex align-items-center">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="back-button me-3"
              onClick={() => navigate("/")}
            />
            <h3>Reviews</h3>
          </div>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <img src={movie?.poster} alt="" />
        </Col>
        <Col>
          {
            <>
              <Row>
                <Col>
                  <ReviewForm
                    handleSubmit={
                      editingReviewId ? handleUpdateReview : addReview
                    }
                    revText={revText}
                    labelText={
                      editingReviewId ? "Update Review" : "Write a Review?"
                    }
                    rating={rating}
                    setRating={setRating}
                    submitButtonText={editingReviewId ? "Update" : "Submit"}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <hr />
                </Col>
              </Row>
            </>
          }
          {reviews?.map((r, index) => {
            return (
              <React.Fragment key={index}>
                <Row>
                  <Col>
                    <div className="review-container">
                      <div className="review-header d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-center mb-2">
                          <div className="review-rating me-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className="star"
                                size={20}
                                color={i < r.rating ? "#ffc107" : "#e4e5e9"}
                              />
                            ))}
                          </div>
                          <span className="text-white">({r.rating}/5)</span>
                        </div>
                        <div className="review-actions">
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="review-action-icon edit-icon me-3"
                            onClick={() => handleEditReview(index, r)}
                          />
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="review-action-icon delete-icon"
                            onClick={() => handleDeleteReview(index, r.id)}
                          />
                        </div>
                      </div>
                      <p className="review-text text-white">{r.body}</p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <hr className="review-divider" />
                  </Col>
                </Row>
              </React.Fragment>
            );
          })}
        </Col>
      </Row>
      <Row>
        <Col>
          <hr />
        </Col>
      </Row>
    </Container>
  );
};

export default Reviews;
