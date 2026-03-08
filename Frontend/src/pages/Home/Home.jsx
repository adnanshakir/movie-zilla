import { useEffect, useState } from "react";
import tmdb from "../../services/tmdb.api.js";
import MovieCard from "../../components/MovieCard/MovieCard";
import "./home.scss";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Hero from "../../components/hero/Hero.jsx";

const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetch(tmdb.getTrending());
      const data = await res.json();
      setMovies(data.results);
    };

    fetchMovies();
  }, []);

  return (
   <>
      <Navbar />
      <Hero />

      <div className="container trending-section">
        <h2>Trending <span>Movies</span></h2>

        <div className="movie-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

      </div>
    </>
  );
};

export default Home;
