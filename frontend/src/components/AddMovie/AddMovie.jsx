import React, { useState } from "react";
import axios from "../../utils/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddMovie = () => {
  const [movie, setMovie] = useState({
    imdbId: "",
    title: "",
    releaseDate: "",
    trailerLink: "",
    genres: "",
    poster: "",
    backdrops: "",
  });

  const isValidUrl = (url) => {
    try {
      return Boolean(new URL(url));
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidUrl(movie.poster)) {
      toast.error("Invalid poster URL");
      return;
    }

    if (movie.trailerLink && !isValidUrl(movie.trailerLink)) {
      toast.error("Invalid trailer URL");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (movie.releaseDate > today) {
      toast.error("Release date cannot be in the future");
      return;
    }

    const formattedMovie = {
      ...movie,
      genres: movie.genres.split(",").map((g) => g.trim()),
      backdrops: movie.backdrops.split(",").map((b) => b.trim()),
    };

    try {
      await axios.post("/api/v1/admin/movies", formattedMovie, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("🎉 Movie added successfully!");

      setMovie({
        imdbId: "",
        title: "",
        releaseDate: "",
        trailerLink: "",
        genres: "",
        poster: "",
        backdrops: "",
      });
    } catch (error) {
      console.error("Add movie error:", error);
      toast.error("Failed to add movie. Check console for details.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-800 rounded-xl shadow-lg">
      <ToastContainer />
      <h2 className="text-2xl text-white font-bold mb-6 text-center">
        🎬 Add New Movie
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="imdbId"
          placeholder="IMDB ID"
          value={movie.imdbId}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          name="title"
          placeholder="Title"
          value={movie.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          name="releaseDate"
          type="date"
          value={movie.releaseDate}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          name="trailerLink"
          placeholder="Trailer Link"
          value={movie.trailerLink}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          name="genres"
          placeholder="Genres (comma separated)"
          value={movie.genres}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          name="poster"
          placeholder="Poster URL"
          value={movie.poster}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        {movie.poster && isValidUrl(movie.poster) && (
          <img
            src={movie.poster}
            alt="Poster Preview"
            className="mt-2 w-40 h-auto rounded-lg border border-gray-500"
          />
        )}
        <textarea
          name="backdrops"
          placeholder="Backdrop URLs (comma separated)"
          value={movie.backdrops}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded transition"
        >
          Add Movie
        </button>
      </form>
    </div>
  );
};

export default AddMovie;
