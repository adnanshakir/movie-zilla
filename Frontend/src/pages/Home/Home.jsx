import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import tmdb from "../../services/tmdb.api.js";
import Navbar from "../../components/Navbar/Navbar.jsx";
import HomeHero from "../../components/HomeHero/HomeHero.jsx";
import HomeFilters from "../../components/HomeFilters/HomeFilters.jsx";
import MovieCard from "../../components/MovieCard/MovieCard.jsx";
import "./home.scss";

// ── Constants ────────────────────────────────────────────────────
const TMDB_BASE      = "https://api.themoviedb.org/3";
const API_KEY        = import.meta.env.VITE_TMDB_API_KEY;
const SKELETON_COUNT = 18;

const CATEGORIES = [
  { key: "trending", label: "Trending"  },
  { key: "popular",  label: "Popular"   },
  { key: "upcoming", label: "Upcoming"  },
  { key: "topRated", label: "Top Rated" },
];

// ── Helpers ──────────────────────────────────────────────────────

const normalize = (item) => ({
  ...item,
  title:        item.title        || item.name,
  release_date: item.release_date || item.first_air_date,
});

// Build the TMDB URL for the grid — includes page for pagination
const buildGridUrl = (category, type, langs, genres, rating, page) => {
  const hasFilter = langs.length > 0 || genres.length > 0 || rating;
  const media     = type === "tv" ? "tv" : "movie";

  if (hasFilter) {
    const params = new URLSearchParams({
      api_key:          API_KEY,
      sort_by:          "popularity.desc",
      "vote_count.gte": 80,
      page,
    });
    if (langs.length)  params.set("with_original_language", langs.join("|"));
    if (genres.length) params.set("with_genres", genres.join(","));
    if (rating)        params.set("vote_average.gte", rating);
    return `${TMDB_BASE}/discover/${media}?${params.toString()}`;
  }

  if (type === "tv") {
    const ep = {
      trending: `${TMDB_BASE}/trending/tv/week`,
      popular:  `${TMDB_BASE}/tv/popular`,
      topRated: `${TMDB_BASE}/tv/top_rated`,
      upcoming: `${TMDB_BASE}/tv/popular`,
    };
    return `${ep[category] ?? ep.trending}?api_key=${API_KEY}&page=${page}`;
  }

  const ep = {
    trending: `${TMDB_BASE}/trending/movie/week`,
    popular:  `${TMDB_BASE}/movie/popular`,
    topRated: `${TMDB_BASE}/movie/top_rated`,
    upcoming: `${TMDB_BASE}/movie/upcoming`,
  };
  return `${ep[category] ?? ep.trending}?api_key=${API_KEY}&page=${page}`;
};

// ── Component ────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();

  const [heroItems, setHeroItems]           = useState([]);
  const [movies, setMovies]                 = useState([]);
  const [page, setPage]                     = useState(1);
  const [hasMore, setHasMore]               = useState(true);
  const [loading, setLoading]               = useState(true);
  const [activeCategory, setActiveCategory] = useState("trending");
  const [filterType, setFilterType]         = useState("movie");
  const [filterRating, setFilterRating]     = useState("");
  const [filterLangs, setFilterLangs]       = useState([]);
  const [filterGenres, setFilterGenres]     = useState([]);

  const sentinelRef = useRef(null);

  // Fetch hero items once (top 5 trending movies for the banner)
  useEffect(() => {
    fetch(tmdb.getTrending())
      .then((r) => r.json())
      .then((data) => setHeroItems((data.results ?? []).slice(0, 5).map(normalize)))
      .catch(() => {});
  }, []);

  // Reset grid when category or any filter changes
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
  }, [activeCategory, filterType, filterRating, filterLangs, filterGenres]);

  // Fetch a single page — runs on page change or after reset
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    const url = buildGridUrl(
      activeCategory, filterType, filterLangs, filterGenres, filterRating, page
    );

    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((data) => {
        const results = (data.results ?? []).map(normalize);
        // page === 1 means it's a fresh load / reset — replace instead of append
        setMovies((prev) => (page === 1 ? results : [...prev, ...results]));
        setHasMore(page < (data.total_pages ?? 1) && results.length > 0);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setHasMore(false);
          setLoading(false);
        }
      });

    // Abort stale request when deps change (prevents race conditions)
    return () => controller.abort();
  }, [page, activeCategory, filterType, filterRating, filterLangs, filterGenres]);

  // IntersectionObserver — triggers next page when sentinel enters viewport.
  // Only active while not loading and more pages exist.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "320px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  // Press "S" (outside an input) → jump to /search
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "s" || e.key === "S") navigate("/search");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const handleFilterChange = useCallback(({ type, rating, langs, genres }) => {
    if (type   !== undefined) setFilterType(type);
    if (rating !== undefined) setFilterRating(rating);
    if (langs  !== undefined) setFilterLangs(langs);
    if (genres !== undefined) setFilterGenres(genres);
  }, []);

  // Show skeleton grid on initial / reset load; show cards + bottom spinner for pagination
  const isInitialLoad = loading && movies.length === 0;

  return (
    <>
      <Navbar />

      <HomeHero items={heroItems} />

      <div className="container home-content">
        {/* ── Category tabs ────────────────────────────────── */}
        <div className="home-tabs" role="tablist" aria-label="Movie categories">
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={activeCategory === key}
              className={`home-tab${activeCategory === key ? " home-tab--active" : ""}`}
              onClick={() => setActiveCategory(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Compact filter bar ───────────────────────────── */}
        <HomeFilters
          filterType={filterType}
          filterRating={filterRating}
          filterLangs={filterLangs}
          filterGenres={filterGenres}
          onChange={handleFilterChange}
        />

        {/* ── Movie grid ──────────────────────────────────── */}
        <div className="home-grid">
          {isInitialLoad
            ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <MovieCard key={`sk-${i}`} movie={null} />
              ))
            : movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
        </div>

        {/* Sentinel div observed for infinite scroll.
            Also hosts the pagination spinner. */}
        <div ref={sentinelRef} className="home-sentinel" aria-hidden="true">
          {loading && movies.length > 0 && (
            <span className="home-spinner" role="status" aria-label="Loading more movies" />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
