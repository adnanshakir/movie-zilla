import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./movieRow.scss";
import MovieCard from "../MovieCard/MovieCard";

const SKELETON_COUNT = 8;

// MovieRow works in two modes:
//  • Controlled  — pass `movies` + `loading` props (Home fetches in parallel)
//  • Self-fetching — pass a `url` prop (category pages, etc.)
const MovieRow = ({ title, url, seeMoreLink, movies: propMovies, loading: propLoading }) => {
  const isControlled = propMovies !== undefined;

  const [localMovies, setLocalMovies] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [error, setError] = useState(false);

  const movies  = isControlled ? propMovies  : localMovies;
  const loading = isControlled ? propLoading : localLoading;

  useEffect(() => {
    if (isControlled) return; // data comes from parent, skip self-fetch

    setLocalLoading(true);
    setError(false);

    const fetchMovies = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setLocalMovies(data.results.slice(0, 18));
      } catch {
        setError(true);
      } finally {
        setLocalLoading(false);
      }
    };

    fetchMovies();
  }, [url, isControlled]);

  return (
    <section className="movie-row">
      <div className="movie-row__header">
        {loading ? (
          <div className="movie-row__title-skeleton" />
        ) : (
          <h2 className="movie-row__title">{title}</h2>
        )}
        {seeMoreLink && !loading && (
          <Link to={seeMoreLink} className="movie-row__see-more">
            See More
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        )}
      </div>

      {error ? (
        <div className="movie-row__error">
          <span>&#9888;</span>
          <p>Failed to load movies. Please try again.</p>
        </div>
      ) : (
        <div className="movie-row__list">
          {loading
            ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <MovieCard key={i} movie={null} />
              ))
            : movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
        </div>
      )}
    </section>
  );
};

export default MovieRow;
