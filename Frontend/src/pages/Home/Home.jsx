import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import tmdb from "../../services/tmdb.api.js";
import MovieRow from "../../components/MovieRow/MovieRow.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./home.scss";

const Home = () => {
  const navigate = useNavigate();

  // Press "S" (not inside an input) to jump straight to search
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "s" || e.key === "S") navigate("/search");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <>
      <Navbar />

      <div className="container trending-section">
        {/* Clickable search bar — navigates to /search */}
        <button
          className="home-search"
          onClick={() => navigate("/search")}
          aria-label="Search movies"
        >
          <svg
            className="home-search__icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <span className="home-search__placeholder">Search movies&hellip;</span>
          <kbd className="home-search__kbd">S</kbd>
        </button>

        <MovieRow title="Trending" url={tmdb.getTrending()} seeMoreLink="/movies/trending" />
        <MovieRow title="Popular Movies" url={tmdb.getPopular()} seeMoreLink="/movies/popular" />
        <MovieRow title="Top Rated" url={tmdb.getTopRated()} seeMoreLink="/movies/top-rated" />
        <MovieRow title="Now Playing" url={tmdb.getNowPlaying()} seeMoreLink="/movies/now-playing" />
        <MovieRow title="Upcoming" url={tmdb.getUpcoming()} seeMoreLink="/movies/upcoming" />
      </div>

      <Footer />
    </>
  );
};

export default Home;
