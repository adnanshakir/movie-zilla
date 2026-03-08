import { Link } from "react-router-dom";
import tmdb from "../../services/tmdb.api.js";
import "./movieCard.scss";

const MovieCard = ({ movie }) => {
  const poster = tmdb.getImageUrl(movie.poster_path);

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-card__poster">
        {poster ? (
          <img src={poster} alt={movie.title} />
        ) : (
          <div className="movie-card__placeholder">No Image</div>
        )}
      </div>

      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.title}</h3>
        <span className="movie-card__rating">
          ⭐ {movie.vote_average.toFixed(1)}
        </span>
      </div>
    </Link>
  );
};

export default MovieCard;
