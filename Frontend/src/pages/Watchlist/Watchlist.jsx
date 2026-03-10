import MovieCard from "../../components/MovieCard/MovieCard.jsx";
import BackButton from "../../components/BackButton/BackButton.jsx";
import useWatchlist from "../../hooks/useWatchlist.js";
import "./watchlist.scss";

const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <div className="watchlist">
      <div className="watchlist__top-bar">
        <BackButton />
      </div>

      <div className="watchlist__header">
        <h1 className="watchlist__title">My Watchlist</h1>
        {watchlist.length > 0 && (
          <span className="watchlist__count">
            {watchlist.length} movie{watchlist.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {watchlist.length === 0 ? (
        <div className="watchlist__empty">
          <div className="watchlist__empty-icon">🎬</div>
          <h2>Your watchlist is empty</h2>
          <p>Add movies from a movie&apos;s detail page to save them here.</p>
        </div>
      ) : (
        <div className="watchlist__grid">
          {watchlist.map((movie) => (
            <div key={movie.id} className="watchlist__item">
              <MovieCard movie={{ vote_average: 0, ...movie }} />
              <button
                className="watchlist__remove"
                onClick={() => removeFromWatchlist(movie.id)}
                aria-label="Remove from watchlist"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
