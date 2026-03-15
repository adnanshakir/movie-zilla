import { useState, useEffect } from "react";
import MovieCard from "../../components/MovieCard/MovieCard.jsx";
import BackButton from "../../components/BackButton/BackButton.jsx";
import tmdb from "../../services/tmdb.api.js";
import "./search.scss";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search — fires 500 ms after the user stops typing
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      setError("");
      return;
    }

    const timerId = setTimeout(() => {
      setLoading(true);
      setError("");
      setHasSearched(true);

      fetch(tmdb.searchMovies(trimmed))
        .then((res) => {
          if (!res.ok) throw new Error("Search failed");
          return res.json();
        })
        .then((data) => {
          setResults(data.results || []);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load movies. Please try again.");
          setLoading(false);
        });
    }, 500);

    return () => clearTimeout(timerId);
  }, [query]);

  const showEmpty   = !loading && !error && hasSearched && results.length === 0;
  const showResults = !loading && !error && results.length > 0;
  const showPrompt  = !hasSearched && !loading;

  return (
    <div className="search">
      {/* Back button — Escape key is handled inside BackButton */}
      <div className="search__top-bar">
        <BackButton />
      </div>

      {/* Search bar */}
      <div className="search__bar-wrap">
        <div className="search__bar">
          <svg
            className="search__icon"
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

          <input
            className="search__input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies & tv shows…"
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />

          {query && (
            <button
              className="search__clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              &#10005;
            </button>
          )}
        </div>
      </div>

      {/* Loading spinner */}
      {loading && (
        <div className="search__loading">
          <span className="search__spinner" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="search__empty">
          <div className="search__empty-icon">&#9888;</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </div>
      )}

      {/* Empty / no results */}
      {showEmpty && (
        <div className="search__empty">
          <div className="search__empty-icon">&#128269;</div>
          <h2>No movies found</h2>
          <p>Try a different title or keyword.</p>
        </div>
      )}

      {/* Prompt before any search */}
      {showPrompt && (
        <div className="search__prompt">
          <div className="search__prompt-icon">&#127916;</div>
          <p>Type a movie title to search</p>
        </div>
      )}

      {/* Results grid */}
      {showResults && (
        <div className="search__results">
          <p className="search__count">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
          <div className="search__grid">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
