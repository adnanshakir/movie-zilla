import { useEffect, useState } from "react";
import tmdb from "../../services/tmdb.api.js";
import MovieRow from "../../components/MovieRow/MovieRow.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import "./home.scss";

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

      <div className="container trending-section">
        <MovieRow title="Trending" url={tmdb.getTrending()} />

        <MovieRow title="Popular Movies" url={tmdb.getPopular()} />

        <MovieRow title="Top Rated" url={tmdb.getTopRated()} />

        <MovieRow title="Now Playing" url={tmdb.getNowPlaying()} />

        <MovieRow title="Upcoming" url={tmdb.getUpcoming()} />
      </div>
    </>
  );
};

export default Home;
