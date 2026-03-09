import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tmdb from "../../services/tmdb.api.js";
import MovieRow from "../../components/MovieRow/MovieRow.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Filters from "../../components/Filters/Filters.jsx";
import "./home.scss";

const SLICE = 18;

const Home = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState({
    trending: [],
    popular: [],
    topRated: [],
    nowPlaying: [],
    upcoming: [],
  });

  // Fetch all five categories in parallel — a single Promise.all so the
  // network requests race concurrently and all rows update together.
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [t, p, tr, np, u] = await Promise.all([
          fetch(tmdb.getTrending()).then((r) => r.json()),
          fetch(tmdb.getPopular()).then((r) => r.json()),
          fetch(tmdb.getTopRated()).then((r) => r.json()),
          fetch(tmdb.getNowPlaying()).then((r) => r.json()),
          fetch(tmdb.getUpcoming()).then((r) => r.json()),
        ]);
        setRows({
          trending:   (t.results  ?? []).slice(0, SLICE),
          popular:    (p.results  ?? []).slice(0, SLICE),
          topRated:   (tr.results ?? []).slice(0, SLICE),
          nowPlaying: (np.results ?? []).slice(0, SLICE),
          upcoming:   (u.results  ?? []).slice(0, SLICE),
        });
      } catch {
        // rows stay empty; MovieRow error state handles display
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

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

        <Filters />

        <MovieRow title="Trending"      movies={rows.trending}   loading={loading} seeMoreLink="/movies/trending" />
        <MovieRow title="Popular Movies" movies={rows.popular}    loading={loading} seeMoreLink="/movies/popular" />
        <MovieRow title="Top Rated"      movies={rows.topRated}   loading={loading} seeMoreLink="/movies/top-rated" />
        <MovieRow title="Now Playing"    movies={rows.nowPlaying} loading={loading} seeMoreLink="/movies/now-playing" />
        <MovieRow title="Upcoming"       movies={rows.upcoming}   loading={loading} seeMoreLink="/movies/upcoming" />
      </div>

      <Footer />
    </>
  );
};

export default Home;
