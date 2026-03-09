import { useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard.jsx";
import BackButton from "../../components/BackButton/BackButton.jsx";
import "./history.scss";

const History = () => {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("history") || "[]");
    } catch {
      return [];
    }
  });

  const clearHistory = () => {
    localStorage.removeItem("history");
    setHistory([]);
  };

  return (
    <div className="history">
      <div className="history__top-bar">
        <BackButton />
      </div>

      <div className="history__header">
        <h1 className="history__title">Watch History</h1>
        {history.length > 0 && (
          <button
            className="btn btn--outline btn--sm"
            onClick={clearHistory}
          >
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="history__empty">
          <div className="history__empty-icon">&#128336;</div>
          <h2>No movies watched yet</h2>
          <p>Start exploring to build your history.</p>
        </div>
      ) : (
        <div className="history__grid">
          {history.map((movie) => (
            <MovieCard key={movie.id} movie={{ vote_average: 0, ...movie }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
