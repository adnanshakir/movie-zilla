import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import tmdb from "../../services/tmdb.api.js";
import BackButton from "../../components/BackButton/BackButton.jsx";
import Cast from "../../components/Cast/Cast.jsx";
import Suggestions from "../../components/Suggestions/Suggestions.jsx";
import "./movieDetails.scss";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  // Fetch movie details from TMDB
  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(tmdb.getMovieDetails(id))
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load movie");
        return res.json();
      })
      .then((data) => {
        setMovie(data);
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
    document.body.style.overflow = showTrailer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showTrailer]);

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

  const toggleFavorite = () => {
    if (!movie) return;
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
            <BackButton disabled={showTrailer} />
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

      {/* ── Cast section ── */}
      <Cast movieId={id} />

      {/* ── Related suggestions ── */}
      <Suggestions movieId={id} />

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
