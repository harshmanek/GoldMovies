import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import api from "../../api/axiosConfig";

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
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="text-white text-2xl mr-4 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <h2 className="text-white text-2xl font-semibold">My Watched Movies</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {reviewedMovies.map((movie) => (
          <div
            key={movie.imdbId}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-full h-64 overflow-hidden">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex justify-center">
              <h3 className="text-white text-center text-lg font-medium">
                {movie.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
