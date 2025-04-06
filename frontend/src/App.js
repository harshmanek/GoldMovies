  import "./App.css";
  import api from "./api/axiosConfig";
  import { useState, useEffect } from "react";
  import Layout from "./components/Layout";
  import { Routes, Route } from "react-router-dom";
  import Home from "./components/home/Home";
  import Header from "./components/header/Header";
  import Trailer from "./components/trailer/Trailer";
  import Reviews from "./components/reviews/Reviews";
  import NotFound from "./components/notFound/NotFound";
  import Watchlist from "./components/watchlist/Watchlist";
  import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoute";
  import LoginPage from "./components/LoginPage";
  import AddMovie from "./components/AddMovie/AddMovie";
  import AddReview from "./components/AddReview/AddReview";
  import Register from "./components/Register";
  import AdminRoute from "./components/AdminRoute/AdminRoute";
  import UserRoute from "./components/UserRoute/UserRoute";
  const App = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [movie, setMovie] = useState();
    const [reviews, setReviews] = useState([]);

    const getMovies = async () => {
      try {
        const response = await api.get("/api/v1/movies");

        setMovies(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const getMovieData = async (movieId) => {
      try {
        const response = await api.get(`/api/v1/movies/${movieId}`);

        const singleMovie = response.data;

        setMovie(singleMovie);

        setReviews(singleMovie.reviews);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      getMovies();
    }, []);

    const handleSearch = (searchTerm) => {
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMovies(filtered);
    };

    return (
      <div className="App">
        <Header onSearch={handleSearch} />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin/add-movie"
              element={
                <AdminRoute>
                  <AddMovie />
                </AdminRoute>
              }
            />
            <Route
              path="/review/add"
              element={
                <UserRoute>
                  <AddReview />
                </UserRoute>
              }
            />
            <Route
              path="/"
              element={
                <Home
                  movies={filteredMovies.length > 0 ? filteredMovies : movies}
                />
              }
            ></Route>
            <Route path="/Trailer/:ytTrailerId" element={<Trailer />}></Route>
            <Route
              path="/Reviews/:movieId"
              element={
                <Reviews
                  getMovieData={getMovieData}
                  movie={movie}
                  reviews={reviews}
                  setReviews={setReviews}
                />
              }
            ></Route>
            <Route path="/watchlist" element={<Watchlist />}></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Route>
        </Routes>
      </div>
    );
  };

  export default App;
