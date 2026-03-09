import { useEffect, useState } from "react";
import MovieCard from "../MovieCard/MovieCard.jsx";
import "./suggestions.scss";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

const Suggestions = ({ movieId }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId || !API_KEY) {
      setMovies([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${TMDB_BASE}/movie/${movieId}/recommendations?api_key=${API_KEY}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setMovies((data.results || []).slice(0, 12));
      })
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, [movieId]);

  if (!loading && movies.length === 0) return null;

  return (
    <section className="suggestions-section">
      <div className="movie-details__section-inner">
        <h2 className="suggestions-title">You may also like</h2>

        <div className="suggestions-row">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <MovieCard key={`suggestion-skeleton-${idx}`} movie={null} />
              ))
            : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </div>
    </section>
  );
};

export default Suggestions;
