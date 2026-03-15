import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import tmdb from "../../services/tmdb.api.js";
import BackButton from "../../components/BackButton/BackButton.jsx";
import Cast from "../../components/Cast/Cast.jsx";
import Suggestions from "../../components/Suggestions/Suggestions.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import useWatchlist from "../../hooks/useWatchlist.js";
import "./movieDetails.scss";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [screenshots, setScreenshots] = useState([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  // Helper: redirect unauthenticated users to login, preserving where they came from
  const requireAuth = () => {
    if (localStorage.getItem("user")) return true;
    navigate("/login", { state: { from: location } });
    return false;
  };

  // Fetch movie details from TMDB
  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      fetch(tmdb.getMovieDetails(id)).then((res) => {
        if (!res.ok) throw new Error("Failed to load movie");
        return res.json();
      }),
      fetch(tmdb.getMovieImages(id))
        .then((res) => (res.ok ? res.json() : { backdrops: [] }))
        .catch(() => ({ backdrops: [] })),
    ])
      .then(([movieData, imagesData]) => {
        setMovie(movieData);

        const uniqueByPath = new Set();
        const nextScreens = (imagesData?.backdrops ?? [])
          .filter((img) => img?.file_path)
          .filter((img) => {
            if (uniqueByPath.has(img.file_path)) return false;
            uniqueByPath.add(img.file_path);
            return true;
          })
          .slice(0, 12);

        setScreenshots(nextScreens);
        setSelectedScreenshot(null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
        setLoading(false);
      });
  }, [id]);

  // Sync favorite state from localStorage whenever movie loads
  useEffect(() => {
    if (!movie) return;
    try {
      const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(saved.some((m) => m.id === movie.id));
    } catch {
      setIsFavorite(false);
    }
  }, [movie]);

  // Write to watch history when movie loads (latest first, no duplicates, max 20)
  useEffect(() => {
    if (!movie) return;
    try {
      const prev = JSON.parse(localStorage.getItem("history") || "[]");
      const entry = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average ?? 0,
      };
      const updated = [
        entry,
        ...prev.filter((m) => m.id !== entry.id),
      ].slice(0, 20);
      localStorage.setItem("history", JSON.stringify(updated));
    } catch {
      // silent
    }
  }, [movie]);

  // Lock page scroll while trailer modal is open
  useEffect(() => {
    document.body.style.overflow = showTrailer || selectedScreenshot ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showTrailer, selectedScreenshot]);

  // Close trailer modal on Escape key (<BackButton> handles Escape when trailer is closed)
  useEffect(() => {
    if (!showTrailer) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsClosing(true);
        setTimeout(() => {
          setShowTrailer(false);
          setIsClosing(false);
        }, 200);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showTrailer]);

  useEffect(() => {
    if (!selectedScreenshot) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setSelectedScreenshot(null);
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        showPrevScreenshot();
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        showNextScreenshot();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedScreenshot, screenshots]);

  const toggleFavorite = () => {
    if (!movie) return;
    if (!requireAuth()) return;
    try {
      const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
      const updated = isFavorite
        ? saved.filter((m) => m.id !== movie.id)
        : [
            ...saved,
            {
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              vote_average: movie.vote_average ?? 0,
            },
          ];
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorite(!isFavorite);
    } catch {}
  };

  const closeTrailer = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowTrailer(false);
      setIsClosing(false);
    }, 200);
  };

  const openScreenshot = (img) => {
    setSelectedScreenshot(img);
  };

  const closeScreenshot = () => {
    setSelectedScreenshot(null);
  };

  const selectedShotIndex = selectedScreenshot
    ? screenshots.findIndex((img) => img.file_path === selectedScreenshot.file_path)
    : -1;

  const showPrevScreenshot = () => {
    if (!screenshots.length || selectedShotIndex < 0) return;
    const prevIndex = (selectedShotIndex - 1 + screenshots.length) % screenshots.length;
    setSelectedScreenshot(screenshots[prevIndex]);
  };

  const showNextScreenshot = () => {
    if (!screenshots.length || selectedShotIndex < 0) return;
    const nextIndex = (selectedShotIndex + 1) % screenshots.length;
    setSelectedScreenshot(screenshots[nextIndex]);
  };

  const trailer = movie?.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube",
  );

  if (loading) {
    return (
      <div className="movie-details movie-details--loading">
        <span className="movie-details__spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-details movie-details--error">
        <p>{error}</p>
      </div>
    );
  }

  if (!movie) return null;

  const posterUrl = tmdb.getImageUrl(movie.poster_path);
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  return (
    <div className="movie-details">
      {/* ── Hero: backdrop + poster + info ── */}
      <div className="movie-details__hero">
        {backdropUrl && (
          <div
            className="movie-details__backdrop"
            style={{ backgroundImage: `url(${backdropUrl})` }}
            aria-hidden="true"
          />
        )}
        <div className="movie-details__hero-overlay" aria-hidden="true" />
        <div className="movie-details__hero-content">
          <div className="movie-details__top-bar">
            <BackButton disabled={showTrailer || !!selectedScreenshot} />
          </div>

          <div className="movie-details__header">
            {/* Poster column */}
            <div className="movie-details__poster">
              {posterUrl ? (
                <img src={posterUrl} alt={movie.title} />
              ) : (
                <div className="movie-details__poster-placeholder">No Image</div>
              )}
            </div>

            {/* Info column */}
            <div className="movie-details__info">
              <h1 className="movie-details__title">{movie.title}</h1>

              <div className="movie-details__meta">
                <span className="movie-details__rating">
                  ⭐ {movie.vote_average?.toFixed(1)}
                </span>
                {year && <span className="movie-details__date">{year}</span>}
                {runtime && (
                  <span className="movie-details__runtime">{runtime}</span>
                )}
              </div>

              {movie.genres?.length > 0 && (
                <div className="movie-details__genres">
                  {movie.genres.map((g) => (
                    <span key={g.id} className="movie-details__genre-tag">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="movie-details__actions">
                <button
                  className={`btn btn--lg ${
                    isFavorite ? "btn--outline" : "btn--primary"
                  }`}
                  onClick={toggleFavorite}
                >
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </button>

                <button
                  className={`btn btn--lg ${
                    movie && isInWatchlist(movie.id) ? "btn--outline" : "btn--outline"
                  }`}
                  onClick={() => {
                    if (!requireAuth()) return;
                    toggleWatchlist(movie);
                  }}
                >
                  {movie && isInWatchlist(movie.id) ? "✓ In Watchlist" : "+ Watchlist"}
                </button>

                {trailer && (
                  <button
                    className="btn btn--outline btn--lg"
                    onClick={() => setShowTrailer(true)}
                  >
                    ▶ Watch Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trailer section (inline embed) ── */}
      {trailer && (
        <section className="movie-details__trailer-section">
          <div className="movie-details__section-inner">
            <h2 className="movie-details__section-heading">Trailer</h2>
            <div className="movie-details__trailer-embed">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={`${movie.title} Trailer`}
                allow="encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Overview section ── */}
      {movie.overview && (
        <section className="movie-details__overview-section">
          <div className="movie-details__section-inner">
            <h2 className="movie-details__section-heading">Overview</h2>
            <p className="movie-details__overview-text">{movie.overview}</p>
          </div>
        </section>
      )}

      {/* ── Screenshots gallery ── */}
      {screenshots.length > 0 && (
        <section className="movie-details__screenshots-section">
          <div className="movie-details__section-inner">
            <h2 className="movie-details__section-heading">Screenshots</h2>

            <div className="movie-details__screenshots-strip" role="list" aria-label="Movie screenshots">
              {screenshots.map((img) => {
                const imageUrl = `https://image.tmdb.org/t/p/w780${img.file_path}`;
                return (
                  <button
                    key={img.file_path}
                    type="button"
                    role="listitem"
                    className="movie-details__screenshot"
                    onClick={() => openScreenshot(img)}
                    aria-label="Open screenshot"
                  >
                    <img src={imageUrl} alt={`${movie.title} screenshot`} loading="lazy" />
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Cast section ── */}
      <Cast movieId={id} />

      {/* ── Related suggestions ── */}
      <Suggestions movieId={id} />

      <Footer />

      {/* ── Screenshot viewer ── */}
      {selectedScreenshot && (
        <div className="movie-details__shot-backdrop" onClick={closeScreenshot}>
          <div className="movie-details__shot-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="movie-details__shot-close"
              onClick={closeScreenshot}
              aria-label="Close screenshot"
            >
              X
            </button>

            <button
              type="button"
              className="movie-details__shot-nav movie-details__shot-nav--prev"
              onClick={showPrevScreenshot}
              aria-label="Previous screenshot"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>

            <button
              type="button"
              className="movie-details__shot-nav movie-details__shot-nav--next"
              onClick={showNextScreenshot}
              aria-label="Next screenshot"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>

            <div className="movie-details__shot-stage">
              <img
                src={`https://image.tmdb.org/t/p/original${selectedScreenshot.file_path}`}
                alt={`${movie.title} screenshot enlarged`}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Trailer modal (full-screen) ── */}
      {showTrailer && trailer && (
        <div
          className={`movie-details__modal-backdrop${
            isClosing ? " movie-details__modal-backdrop--closing" : ""
          }`}
          onClick={closeTrailer}
        >
          <div
            className={`movie-details__modal${
              isClosing ? " movie-details__modal--closing" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="movie-details__modal-close"
              onClick={closeTrailer}
              aria-label="Close trailer"
            >
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title={`${movie.title} Trailer`}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
