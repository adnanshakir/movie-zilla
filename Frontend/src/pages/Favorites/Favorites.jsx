import { useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard.jsx";
import BackButton from "../../components/BackButton/BackButton.jsx";
import "./favorites.scss";

const Favorites = () => {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });

  const removeFromFavorites = (movieId) => {
    const updated = favorites.filter((m) => m.id !== movieId);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="favorites">
      <div className="favorites__top-bar">
        <BackButton />
      </div>
      <div className="favorites__header">
        <h1 className="favorites__title">My Favorites</h1>
        {favorites.length > 0 && (
          <span className="favorites__count">
            {favorites.length} movie{favorites.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="favorites__empty">
          <div className="favorites__empty-icon">♡</div>
          <h2>No favorites yet</h2>
          <p>You haven&apos;t added any favorites yet.</p>
        </div>
      ) : (
        <div className="favorites__grid">
          {favorites.map((movie) => (
            <div key={movie.id} className="favorites__item">
              <MovieCard movie={{ vote_average: 0, ...movie }} />
              <button
                className="favorites__remove"
                onClick={() => removeFromFavorites(movie.id)}
                aria-label="Remove from favorites"
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

export default Favorites;
