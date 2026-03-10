import { useState } from "react";

const STORAGE_KEY = "watchlist";

const readStorage = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

/**
 * useWatchlist — localStorage-backed watchlist state.
 *
 * Returns:
 *   watchlist        – array of saved movie objects
 *   isInWatchlist(id) – boolean check
 *   addToWatchlist(movie) – saves movie entry
 *   removeFromWatchlist(id) – removes by movie id
 *   toggleWatchlist(movie) – add or remove in one call
 */
const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState(readStorage);

  const persist = (updated) => {
    setWatchlist(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const isInWatchlist = (id) => watchlist.some((m) => m.id === id);

  const addToWatchlist = (movie) => {
    if (isInWatchlist(movie.id)) return;
    const entry = {
      id:           movie.id,
      title:        movie.title || movie.name,
      poster_path:  movie.poster_path,
      vote_average: movie.vote_average ?? 0,
      release_date: movie.release_date || movie.first_air_date || "",
    };
    persist([...watchlist, entry]);
  };

  const removeFromWatchlist = (id) => {
    persist(watchlist.filter((m) => m.id !== id));
  };

  const toggleWatchlist = (movie) => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return { watchlist, isInWatchlist, addToWatchlist, removeFromWatchlist, toggleWatchlist };
};

export default useWatchlist;
