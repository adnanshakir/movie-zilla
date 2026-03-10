import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import tmdb from "../../services/tmdb.api.js";
import Navbar from "../../components/Navbar/Navbar.jsx";
import BackButton from "../../components/BackButton/BackButton.jsx";
import MovieCard from "../../components/MovieCard/MovieCard.jsx";
import "./personPage.scss";

const BACKDROP_SIZE = "https://image.tmdb.org/t/p/w780";

// Calculate age from a date string
const calcAge = (dob, dod) => {
  if (!dob) return null;
  const end = dod ? new Date(dod) : new Date();
  const age = end.getFullYear() - new Date(dob).getFullYear();
  const hasBirthdayPassed =
    end.getMonth() > new Date(dob).getMonth() ||
    (end.getMonth() === new Date(dob).getMonth() &&
      end.getDate() >= new Date(dob).getDate());
  return hasBirthdayPassed ? age : age - 1;
};

const fmt = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
};

const PersonPage = () => {
  const { id } = useParams();
  const [person, setPerson]       = useState(null);
  const [movies, setMovies]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [expanded, setExpanded]   = useState(false);
  const [visibleCount, setVisibleCount] = useState(18);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");
    setPerson(null);
    setMovies([]);
    setVisibleCount(18);

    const ctrl = new AbortController();

    Promise.all([
      fetch(tmdb.getPerson(id),             { signal: ctrl.signal }).then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
      fetch(tmdb.getPersonMovieCredits(id), { signal: ctrl.signal }).then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
    ])
      .then(([personData, creditsData]) => {
        setPerson(personData);
        // Sort cast credits by popularity desc, deduplicate by movie id
        const seen = new Set();
        const sorted = (creditsData.cast || [])
          .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
          .filter((m) => {
            if (seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
          });
        setMovies(sorted);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError("Could not load actor information. Please try again.");
        }
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="person-page person-page--loading">
          <span className="person-page__spinner" role="status" aria-label="Loading" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="person-page person-page--error">
          <BackButton />
          <p>{error}</p>
        </div>
      </>
    );
  }

  if (!person) return null;

  const profileUrl  = tmdb.getPersonImageUrl(person.profile_path, "w342");
  const backdropUrl = person.profile_path ? `${BACKDROP_SIZE}${person.profile_path}` : null;
  const age         = calcAge(person.birthday, person.deathday);
  const biography   = person.biography || "";
  const bioShort    = biography.length > 480 ? biography.slice(0, 480) + "…" : biography;

  return (
    <>
      <Navbar />

      <div className="person-page">
        {/* ── Blurred backdrop ─────────────────────────────── */}
        {backdropUrl && (
          <div
            className="person-page__backdrop"
            style={{ backgroundImage: `url(${backdropUrl})` }}
            aria-hidden="true"
          />
        )}
        <div className="person-page__backdrop-overlay" aria-hidden="true" />

        {/* ── Sticky back button ───────────────────────────── */}
        <div className="container person-page__back">
            <BackButton />
        </div>

        {/* ── Actor info ───────────────────────────────────── */}
        <div className="container person-page__hero">
          {/* Left: portrait */}
          <div className="person-page__portrait-wrap">
            {profileUrl ? (
              <img
                className="person-page__portrait"
                src={profileUrl}
                alt={person.name}
              />
            ) : (
              <div className="person-page__portrait-placeholder" aria-hidden="true">
                <svg width="60" height="60" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="30" r="18" fill="currentColor" opacity=".35" />
                  <ellipse cx="40" cy="72" rx="28" ry="18" fill="currentColor" opacity=".25" />
                </svg>
              </div>
            )}
          </div>

          {/* Right: info */}
          <div className="person-page__info">
            <h1 className="person-page__name">{person.name}</h1>

            {person.known_for_department && (
              <span className="person-page__dept">
                {person.known_for_department}
              </span>
            )}

            <dl className="person-page__meta">
              {person.birthday && (
                <>
                  <dt>Born</dt>
                  <dd>
                    {fmt(person.birthday)}
                    {age !== null && (
                      <span className="person-page__age">
                        &nbsp;({person.deathday ? `died age ${age}` : `age ${age}`})
                      </span>
                    )}
                  </dd>
                </>
              )}
              {person.deathday && (
                <>
                  <dt>Died</dt>
                  <dd>{fmt(person.deathday)}</dd>
                </>
              )}
              {person.place_of_birth && (
                <>
                  <dt>Birthplace</dt>
                  <dd>{person.place_of_birth}</dd>
                </>
              )}
              {person.popularity != null && (
                <>
                  <dt>Popularity</dt>
                  <dd>{person.popularity.toFixed(1)}</dd>
                </>
              )}
            </dl>

            {biography && (
              <div className="person-page__bio">
                <p>{expanded ? biography : bioShort}</p>
                {biography.length > 480 && (
                  <button
                    className="person-page__bio-toggle"
                    onClick={() => setExpanded((v) => !v)}
                    type="button"
                  >
                    {expanded ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Movies section ───────────────────────────────── */}
        {movies.length > 0 && (
          <section className="container person-page__movies">
            <h2 className="person-page__movies-heading">
              Movies Featuring This Actor
            </h2>
            <div className="person-page__grid">
              {movies.slice(0, visibleCount).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            {visibleCount < movies.length && (
              <div className="person-page__load-more">
                <button
                  className="person-page__load-more-btn"
                  onClick={() => setVisibleCount((c) => c + 18)}
                  type="button"
                >
                  See More
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
};

export default PersonPage;
