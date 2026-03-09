import { useEffect, useState } from "react";
import MovieCard from "../MovieCard/MovieCard.jsx";
import "./suggestions.scss";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

const getRandomPage = () => Math.floor(Math.random() * 20) + 1;

const fetchFallbackRandomMovies = () => {
  const randomPage = getRandomPage();
  const url = `${TMDB_BASE}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${randomPage}`;

  return fetch(url)
    .then((res) => (res.ok ? res.json() : Promise.reject()))
    .then((data) => {
      const pool = data.results || [];
      // Shuffle so fallback does not always look the same.
      return [...pool]
        .sort(() => Math.random() - 0.5)
        .slice(0, 12);
    });
};

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
        const related = (data.results || []).slice(0, 12);
        if (related.length > 0) {
          setMovies(related);
          return;
        }

        return fetchFallbackRandomMovies().then((fallback) => {
          setMovies(fallback);
        });
      })
      .catch(() => {
        fetchFallbackRandomMovies()
          .then((fallback) => setMovies(fallback))
          .catch(() => setMovies([]));
      })
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
