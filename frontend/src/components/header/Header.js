import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../images/logo.png";

const Header = ({ onSearch }) => {
  const { auth, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setMenuOpen(false); // Close menu on search (optional)
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo + Brand */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="Golden Movies Logo"
            className="h-10 w-auto rounded"
          />
          <span className="text-xl font-bold text-yellow-400">
            Golden Movies
          </span>
        </div>

        {/* Hamburger for small screens */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-yellow-400 focus:outline-none"
          >
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>

        {/* Full nav menu */}
        <nav
          className={`lg:flex items-center gap-6 ${
            menuOpen ? "block" : "hidden"
          } lg:block absolute lg:static top-16 left-0 w-full lg:w-auto bg-gray-900 lg:bg-transparent px-4 py-4 lg:py-0`}
        >
          <NavLink
            to="/"
            className="block py-2 lg:inline hover:text-yellow-400"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/watchlist"
            className="block py-2 lg:inline hover:text-yellow-400"
            onClick={() => setMenuOpen(false)}
          >
            Watchlist
          </NavLink>
          {auth.role === "ADMIN" && (
            <NavLink
              to="/admin/add-movie"
              className="block py-2 lg:inline hover:text-yellow-400"
              onClick={() => setMenuOpen(false)}
            >
              Add Movie
            </NavLink>
          )}

          {!auth.token ? (
            <button
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-1 px-4 rounded mt-2 lg:mt-0"
            >
              Login
            </button>
          ) : (
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 mt-2 lg:mt-0">
              <span className="text-sm text-gray-300">
                Welcome, <strong>{auth.username || "User"}</strong>
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold py-1 px-4 rounded"
              >
                Logout
              </button>
            </div>
          )}

          {/* Search form */}
          <form
            onSubmit={handleSearch}
            className="mt-3 lg:mt-0 flex w-full lg:w-auto items-center"
          >
            <input
              type="text"
              placeholder="Search movies..."
              className="bg-gray-800 text-white border border-gray-600 rounded-l px-3 py-1 w-full lg:w-64 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1 rounded-r"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
};

export default Header;
