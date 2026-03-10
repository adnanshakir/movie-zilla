import { useState } from "react";
import "./homeFilters.scss";

const LANGUAGES = [
  { label: "English",  code: "en" },
  { label: "Hindi",    code: "hi" },
  { label: "Korean",   code: "ko" },
  { label: "Japanese", code: "ja" },
  { label: "French",   code: "fr" },
  { label: "Spanish",  code: "es" },
];

const GENRES = [
  { label: "Action",    id: 28    },
  { label: "Comedy",    id: 35    },
  { label: "Drama",     id: 18    },
  { label: "Thriller",  id: 53    },
  { label: "Sci-Fi",    id: 878   },
  { label: "Animation", id: 16    },
  { label: "Horror",    id: 27    },
  { label: "Romance",   id: 10749 },
];

const RATING_OPTIONS = [
  { label: "All", value: ""  },
  { label: "7+",  value: "7" },
  { label: "8+",  value: "8" },
  { label: "9+",  value: "9" },
];

/**
 * HomeFilters — compact inline filter bar for the Home page.
 *
 * Props:
 *   filterType    "movie" | "tv"
 *   filterRating  "" | "7" | "8" | "9"
 *   filterLangs   string[]   (language codes)
 *   filterGenres  number[]   (TMDB genre IDs)
 *   onChange      (patch: Partial<filters>) => void
 */
const HomeFilters = ({
  filterType,
  filterRating,
  filterLangs,
  filterGenres,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleLang = (code) =>
    onChange({
      langs: filterLangs.includes(code)
        ? filterLangs.filter((c) => c !== code)
        : [...filterLangs, code],
    });

  const toggleGenre = (id) =>
    onChange({
      genres: filterGenres.includes(id)
        ? filterGenres.filter((g) => g !== id)
        : [...filterGenres, id],
    });

  const handleReset = () => onChange({ langs: [], genres: [] });

  const activeCount = filterLangs.length + filterGenres.length;

  return (
    <div className="hf-wrapper">
      {/* ── Quick filter row ──────────────────────────────────── */}
      <div className="hf-row">
        {/* Type: Movie / Series */}
        <div className="hf-group" role="group" aria-label="Content type">
          <button
            className={`hf-pill${filterType === "movie" ? " hf-pill--active" : ""}`}
            onClick={() => onChange({ type: "movie" })}
            type="button"
          >
            Movies
          </button>
          <button
            className={`hf-pill${filterType === "tv" ? " hf-pill--active" : ""}`}
            onClick={() => onChange({ type: "tv" })}
            type="button"
          >
            Series
          </button>
        </div>

        <span className="hf-sep" aria-hidden="true" />

        {/* Rating */}
        <div className="hf-group" role="group" aria-label="Minimum rating">
          {RATING_OPTIONS.map((r) => (
            <button
              key={r.value}
              className={`hf-pill${filterRating === r.value ? " hf-pill--active" : ""}`}
              onClick={() => onChange({ rating: r.value })}
              type="button"
            >
              {r.value ? `★ ${r.label}` : r.label}
            </button>
          ))}
        </div>

        {/* More filters toggle — shows Language + Genre */}
        <button
          className={`hf-more${isOpen ? " hf-more--open" : ""}`}
          onClick={() => setIsOpen((v) => !v)}
          type="button"
          aria-expanded={isOpen}
          aria-controls="hf-panel"
        >
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.2"
            aria-hidden="true"
          >
            <line x1="4"  y1="6"  x2="20" y2="6"  />
            <line x1="8"  y1="12" x2="16" y2="12" />
            <line x1="10" y1="18" x2="14" y2="18" />
          </svg>
          Filters
          {activeCount > 0 && (
            <span className="hf-badge">{activeCount}</span>
          )}
          <svg
            className="hf-chevron"
            width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* ── Collapsible Language + Genre panel ───────────────── */}
      <div
        id="hf-panel"
        className={`hf-panel${isOpen ? " hf-panel--open" : ""}`}
        aria-hidden={!isOpen}
      >
        <div className="hf-panel__inner">
          {/* Language chips */}
          <div className="hf-section">
            <span className="hf-label">Language</span>
            <div className="hf-chips">
              {LANGUAGES.map(({ label, code }) => (
                <button
                  key={code}
                  className={`hf-chip${filterLangs.includes(code) ? " hf-chip--active" : ""}`}
                  onClick={() => toggleLang(code)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Genre chips */}
          <div className="hf-section">
            <span className="hf-label">Genre</span>
            <div className="hf-chips">
              {GENRES.map(({ label, id }) => (
                <button
                  key={id}
                  className={`hf-chip${filterGenres.includes(id) ? " hf-chip--active" : ""}`}
                  onClick={() => toggleGenre(id)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset row — only shown when something is active */}
          {activeCount > 0 && (
            <div className="hf-actions">
              <button className="hf-reset" onClick={handleReset} type="button">
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeFilters;
