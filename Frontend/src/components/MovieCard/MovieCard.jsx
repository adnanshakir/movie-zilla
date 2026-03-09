import { Link } from "react-router-dom";
import "./movieCard.scss";

// w342 is significantly smaller than w500 and covers the 210px card width
const POSTER_BASE = "https://image.tmdb.org/t/p/w342";

const MovieCard = ({ movie }) => {
  // Render skeleton when no data is available yet
  if (!movie) {
    return (
      <div className="movie-card movie-card--skeleton" aria-hidden="true">
        <div className="movie-poster movie-poster--skeleton" />
        <div className="movie-card__skeleton-info">
          <div className="movie-card__title-skeleton" />
          <div className="movie-card__year-skeleton" />
        </div>
      </div>
    );
  }

  const poster = movie.poster_path ? `${POSTER_BASE}${movie.poster_path}` : null;
  const year = movie.release_date ? movie.release_date.slice(0, 4) : null;

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-poster">
        {poster ? (
          <img src={poster} alt={movie.title} loading="lazy" />
        ) : (
          <div className="movie-card__placeholder">No Image</div>
        )}
        <span className="movie-rating">⭐ {movie.vote_average?.toFixed(1) ?? "N/A"}</span>
      </div>
      <h3 className="movie-title">{movie.title}</h3>
      {year && <span className="movie-year">{year}</span>}
    </Link>
  );
};

export default MovieCard;
