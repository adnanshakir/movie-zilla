import React from "react";
import { useEffect, useState } from "react";
import "./movieRow.scss";
import MovieCard from "../MovieCard/MovieCard";

const MovieRow = ({ title, url }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetch(url);
      const data = await res.json();

      setMovies(data.results.slice(0, 18));
    };

    fetchMovies();
  }, [url]);

  return (
    <section className="movie-row">
      <h2 className="movie-row__title">{title}</h2>

      <div className="movie-row__list">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default MovieRow;
