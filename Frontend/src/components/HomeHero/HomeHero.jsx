import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./homeHero.scss";

const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";
const INTERVAL_MS   = 7000;
const FADE_MS       = 420;

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const HomeHero = ({ items = [] }) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  // Auto-rotate slides
  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % items.length);
        setVisible(true);
      }, FADE_MS);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [items.length]);

  const jumpTo = (i) => {
    if (i === current) return;
    setVisible(false);
    setTimeout(() => {
      setCurrent(i);
      setVisible(true);
    }, FADE_MS);
  };

  if (!items.length) {
    return <div className="hero hero--skeleton" aria-hidden="true" />;
  }

  const item     = items[current];
  const backdrop = item.backdrop_path ? `${BACKDROP_BASE}${item.backdrop_path}` : null;
  const title    = item.title || item.name || "Untitled";
  const year     = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating   = item.vote_average?.toFixed(1);
  const overview = item.overview
    ? item.overview.length > 180
      ? item.overview.slice(0, 180) + "…"
      : item.overview
    : "";

  return (
    <section className="hero" aria-label="Featured content">
      {/* Full-bleed backdrop */}
      <div
        className={`hero__backdrop${visible ? " hero__backdrop--visible" : ""}`}
        style={backdrop ? { backgroundImage: `url(${backdrop})` } : undefined}
        role="img"
        aria-label={title}
      />

      {/* Bottom gradient overlay */}
      <div className="hero__overlay" />

      {/* Content — fades in/out with the backdrop */}
      <div className={`hero__content${visible ? " hero__content--visible" : ""}`}>
        <div className="container">
          <div className="hero__body">
            {/* Year + Rating row */}
            <div className="hero__meta">
              {year && <span className="hero__year">{year}</span>}
              {rating && (
                <span className="hero__rating">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  {rating}
                </span>
              )}
            </div>

            <h1 className="hero__title">{title}</h1>

            {overview && <p className="hero__overview">{overview}</p>}

            {/* CTA buttons */}
            <div className="hero__actions">
              <button
                className="hero__btn hero__btn--watch"
                onClick={() => navigate(`/movie/${item.id}`)}
                type="button"
              >
                <PlayIcon />
                Watch
              </button>
              <button
                className="hero__btn hero__btn--details"
                onClick={() => navigate(`/movie/${item.id}`)}
                type="button"
              >
                Details
              </button>
            </div>

            {/* Search bar */}
            <button
              className="hero__search"
              onClick={() => navigate("/search")}
              aria-label="Search movies and TV shows"
              type="button"
            >
              <svg
                className="hero__search-icon"
                width="16" height="16"
                viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <span className="hero__search-placeholder">Search movies &amp; TV Shows…</span>
              <kbd className="hero__search-kbd">S</kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      {items.length > 1 && (
        <div className="hero__dots" role="tablist" aria-label="Featured slides">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              className={`hero__dot${i === current ? " hero__dot--active" : ""}`}
              onClick={() => jumpTo(i)}
              aria-label={`Slide ${i + 1}`}
              aria-selected={i === current}
              type="button"
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HomeHero;
