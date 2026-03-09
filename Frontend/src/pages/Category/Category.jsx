import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import MovieCard from "../../components/MovieCard/MovieCard.jsx";
import BackButton from "../../components/BackButton/BackButton.jsx";
import "./category.scss";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

const CATEGORY_TABS = [
  { label: "Trending", value: "trending" },
  { label: "Movies", value: "movies" },
  { label: "TV Shows", value: "tv" },
  { label: "Top Rated", value: "top_rated" },
];

const ENDPOINTS = {
  trending: "/trending/movie/week",
  movies: "/discover/movie",
  tv: "/discover/tv",
  top_rated: "/movie/top_rated",
};

const VALID_TYPES = new Set(Object.keys(ENDPOINTS));

const normalizeMovies = (items, type) => {
  if (type !== "tv") return items;
  return items.map((item) => ({
    ...item,
    title: item.title || item.name || "Untitled",
    release_date: item.release_date || item.first_air_date,
  }));
};

const CategoryContent = ({ search }) => {
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const rawType = params.get("type") || "trending";
  const type = VALID_TYPES.has(rawType) ? rawType : "trending";

  const [movies,  setMovies]  = useState([]);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [empty,   setEmpty]   = useState(false);

  const loaderRef  = useRef(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { hasMoreRef.current = hasMore;  }, [hasMore]);

  // Invalid URL values fall back to trending and normalize the URL.
  useEffect(() => {
    if (VALID_TYPES.has(rawType)) return;
    navigate("/category?type=trending", { replace: true });
  }, [navigate, rawType]);

  // Reset list and paging when the category type changes.
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    setEmpty(false);
  }, [type]);

  // Fetch whenever page increments or category type changes.
  useEffect(() => {
    if (!API_KEY) {
      setHasMore(false);
      setEmpty(true);
      return;
    }

    setLoading(true);
    const endpoint = ENDPOINTS[type] || ENDPOINTS.trending;
    const query = new URLSearchParams({ api_key: API_KEY, page: String(page) });
    const url = `${TMDB_BASE}${endpoint}?${query.toString()}`;

    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        const incoming = normalizeMovies(data.results ?? [], type);
        setMovies((prev) => {
          const seen = new Set(prev.map((m) => m.id));
          const merged = [...prev, ...incoming.filter((m) => !seen.has(m.id))];
          if (merged.length === 0) setEmpty(true);
          return merged;
        });
        if (page >= (data.total_pages ?? 1)) setHasMore(false);
      })
      .catch(() => setHasMore(false))
      .finally(() => setLoading(false));
  }, [page, type]);

  // IntersectionObserver — one-time setup, reads state via refs
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

  const activeLabel = CATEGORY_TABS.find((tab) => tab.value === type)?.label || "Trending";

  return (
    <>
      <Navbar />
      <div className="category__container">
        <div className="category__top-bar">
          <BackButton />
        </div>

        <h1 className="category__title">{activeLabel}</h1>

        <div className="category__tabs" role="tablist" aria-label="Movie categories">
          {CATEGORY_TABS.map((tab) => {
            const isActive = tab.value === type;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`category__tab ${isActive ? "category-active" : ""}`}
                onClick={() => navigate(`/category?type=${tab.value}`)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {empty && !loading ? (
          <div className="category__empty">
            <span className="category__empty-icon">🎬</span>
            <p>No titles found for this category.</p>
            <span className="category__empty-hint">Try another category.</span>
          </div>
        ) : (
          <div className="category__grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {/* Scroll sentinel */}
        <div ref={loaderRef} className="category__loader">
          {loading && <div className="category__spinner" />}
          {!hasMore && movies.length > 0 && (
            <p className="category__end">You&apos;ve reached the end.</p>
          )}
        </div>
      </div>
    </>
  );
};

const Category = () => {
  const location = useLocation();
  const { search } = location;
  return <CategoryContent key={search} search={search} />;
};

export default Category;
