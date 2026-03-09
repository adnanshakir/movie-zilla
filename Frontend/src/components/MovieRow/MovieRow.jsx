import { useEffect, useState } from "react";
import "./movieRow.scss";
import MovieCard from "../MovieCard/MovieCard";

const MovieRow = ({ title, url }) => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setMovies(data.results.slice(0, 18));
      } catch {
        setError(true);
      }
    };

    fetchMovies();
  }, [url]);

  return (
    <section className="movie-row">
      <h2 className="movie-row__title">{title}</h2>

      {error ? (
        <div className="movie-row__error">
          <span>&#9888;</span>
          <p>Failed to load movies. Please try again.</p>
        </div>
      ) : (
        <div className="movie-row__list">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MovieRow;
