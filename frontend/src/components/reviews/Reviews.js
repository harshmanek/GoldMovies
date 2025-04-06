import { useContext, useEffect, useRef, useState } from "react";
import api from "../../api/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import ReviewForm from "../reviewForm/ReviewForm";
import { FaStar } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./Reviews.css";
import { AuthContext } from "../../context/AuthContext";
import React from "react";

const Reviews = ({ getMovieData, movie, reviews, setReviews }) => {
  const { auth } = useContext(AuthContext);
  const revText = useRef();
  const [rating, setRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const params = useParams();
  const movieId = params.movieId;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    getMovieData(movieId);
  }, []);

  const addReview = async (e) => {
    e.preventDefault();
    const rev = revText.current;

    if (!rating || rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5 stars.");
      return;
    }

    try {
      const payload = {
        reviewBody: rev.value,
        imdbId: movieId,
        rating: parseInt(rating),
      };

      const response = await api.post("/api/v1/reviews", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newReview = response.data;
      const updatedReviews = [
        ...reviews,
        {
          id: newReview.id,
          body: newReview.body,
          rating: parseInt(rating),
          username: newReview.username,
          created: new Date().toISOString(),
        },
      ];

      rev.value = "";
      setRating(0);
      setReviews(updatedReviews);
    } catch (err) {
      console.error("Review submission failed:", err);
    }
  };

  const handleEditReview = (index, review) => {
    revText.current.value = review.body;
    setRating(review.rating);
    setEditingReviewId(review.id);
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    const rev = revText.current;

    try {
      await api.put(
        `/api/v1/reviews/${editingReviewId}`,
        {
          reviewBody: rev.value,
          rating: parseInt(rating),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedReviews = reviews.map((r) =>
        r.id === editingReviewId
          ? { ...r, body: rev.value, rating: parseInt(rating) }
          : r
      );

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
        await api.delete(`/api/v1/reviews/${reviewId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const updatedReviews = reviews.filter((r) => r.id !== reviewId);
        setReviews(updatedReviews);
      } catch (err) {
        console.error("Error deleting review:", err);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 text-white">
      <div className="flex items-center mb-6">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="text-gold-500 hover:text-gold-300 cursor-pointer text-xl mr-3"
          onClick={() => navigate("/")}
        />
        <h3 className="text-2xl font-semibold">Reviews</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <img
            src={movie?.poster}
            alt={movie?.title}
            className="w-full rounded-lg shadow-md"
          />
        </div>

        <div>
          {token ? (
            <ReviewForm
              handleSubmit={editingReviewId ? handleUpdateReview : addReview}
              revText={revText}
              labelText={editingReviewId ? "Update Review" : "Write a review?"}
              rating={rating}
              setRating={setRating}
              submitButtonText={editingReviewId ? "Update" : "Submit"}
            />
          ) : (
            <p className="text-gray-300">
              Please{" "}
              <span
                className="text-gold-400 cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </span>{" "}
              or{" "}
              <span
                className="text-gold-400 cursor-pointer hover:underline"
                onClick={() => navigate("/register")}
              >
                register
              </span>{" "}
              to write a review
            </p>
          )}
        </div>
      </div>

      <hr className="border-gray-600 mb-6" />

      <div className="space-y-6">
        {reviews?.map((r, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center mb-1">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className="star"
                        size={20}
                        color={i < r.rating ? "#ffc107" : "#e4e5e9"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-300">({r.rating}/5)</span>
                </div>
                <p className="text-sm text-gray-400 m-0">by {r.username}</p>
              </div>

              {r.username === username && (
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="cursor-pointer text-blue-400 hover:text-blue-300"
                    onClick={() => handleEditReview(index, r)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="cursor-pointer text-red-400 hover:text-red-300"
                    onClick={() => handleDeleteReview(index, r.id)}
                  />
                </div>
              )}
            </div>
            <p className="text-white">{r.body}</p>
          </div>
        ))}
      </div>

      <hr className="border-gray-600 mt-10" />
    </div>
  );
};

export default Reviews;
