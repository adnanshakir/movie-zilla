import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import MovieCard from "../../components/MovieCard/MovieCard.jsx";
import BackButton from "../../components/BackButton/BackButton.jsx";
import tmdb from "../../services/tmdb.api.js";
import "./movieCategory.scss";

const CATEGORY_CONFIG = {
  trending: {
    title: "Trending Movies",
    getUrl: (page) => `${tmdb.getTrending()}&page=${page}`,
  },
  popular: {
    title: "Popular Movies",
    getUrl: (page) => tmdb.getPopular(page),
  },
  "top-rated": {
    title: "Top Rated Movies",
    getUrl: (page) => tmdb.getTopRated(page),
  },
  upcoming: {
    title: "Upcoming Movies",
    getUrl: (page) => tmdb.getUpcoming(page),
  },
  "now-playing": {
    title: "Now Playing",
    getUrl: (page) => tmdb.getNowPlaying(page),
  },
};

// Inner component; keyed by category so state fully resets on navigation.
const MovieCategoryContent = ({ category }) => {
  const config = CATEGORY_CONFIG[category];

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef(null);
  // Refs let the IntersectionObserver callback read current values
  // without needing to be recreated on every render.
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // Fetch the current page whenever `page` increments.
  useEffect(() => {
    if (!config) return;

    setLoading(true);

    fetch(config.getUrl(page))
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const incoming = data.results ?? [];
        setMovies((prev) => {
          const seen = new Set(prev.map((m) => m.id));
          return [...prev, ...incoming.filter((m) => !seen.has(m.id))];
        });
        if (page >= (data.total_pages ?? 1)) setHasMore(false);
      })
      .catch(() => setHasMore(false))
      .finally(() => setLoading(false));
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  // IntersectionObserver – set up once; reads loading/hasMore via refs.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingRef.current && hasMoreRef.current) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "300px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  if (!config) {
    return (
      <>
        <Navbar />
        <div className="movie-category__container">
          <div className="movie-category__top-bar">
            <BackButton />
          </div>
          <p className="movie-category__not-found">Category not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="movie-category__container">
        <div className="movie-category__top-bar">
          <BackButton />
        </div>

        <h1 className="movie-category__title">{config.title}</h1>

        <div className="movie-category__grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Sentinel element watched by the IntersectionObserver */}
        <div ref={loaderRef} className="movie-category__loader">
          {loading && <div className="movie-category__spinner" />}
          {!hasMore && movies.length > 0 && (
            <p className="movie-category__end">You&apos;ve seen it all!</p>
          )}
        </div>
      </div>
    </>
  );
};

// Wrapper extracts the param and keys the inner component so that
// navigating between categories always mounts a fresh instance.
const MovieCategory = () => {
  const { category } = useParams();
  return <MovieCategoryContent key={category} category={category} />;
};

export default MovieCategory;
