import React, { useRef, useState } from "react";
import ReviewForm from "../reviewForm/ReviewForm";
import api from "../../api/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";

const AddReview = ({ setReviews, reviews }) => {
  const revText = useRef();
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const { movieId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rev = revText.current;

    try {
      const response = await api.post("/api/v1/reviews", {
        reviewBody: rev.value,
        imdbId: movieId,
        rating: parseInt(rating),
      });
      const newReview = {
        body: rev.value,
        rating: parseInt(rating),
        created: new Date().toISOString(),
      };
      setReviews([...reviews, newReview]);
      navigate(`/Reviews/${movieId}`);
    } catch (error) {
      console.error("Failed to submit review:", err);
    }
  };
  return (
    <div className="container mt-4">
      <h3>Add a Review</h3>
      <ReviewForm
        handleSubmit={handleSubmit}
        revText={revText}
        labelText="Write your review"
        rating={rating}
        setRating={setRating}
        submitButtonText="Submit"
      />
    </div>
  );
};

export default AddReview;
