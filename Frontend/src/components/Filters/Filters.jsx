import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./filters.scss";

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

const RATINGS = [
  { label: "NR", code: "NR" },
  { label: "G", code: "G" },
  { label: "PG", code: "PG" },
  { label: "PG-13", code: "PG-13" },
  { label: "R", code: "R" },
  { label: "NC-17", code: "NC-17" },
];

const YEARS = Array.from({ length: 10 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { label: String(year), code: year };
});

const Filters = ({
  initialLangs = [],
  initialGenres = [],
  initialRatings = [],
  initialYears = [],
}) => {
  const navigate = useNavigate();
  // Keep filter panel initially closed on all devices.
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLangs, setSelectedLangs] = useState(initialLangs);
  const [selectedGenres, setSelectedGenres] = useState(initialGenres);
  const [selectedRatings, setSelectedRatings] = useState(initialRatings);
  const [selectedYears, setSelectedYears] = useState(initialYears);

  const toggle = (list, setList, value) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    if (selectedLangs.length) params.set("lang", selectedLangs.join(","));
    if (selectedGenres.length) params.set("genre", selectedGenres.join(","));
    if (selectedRatings.length)
      params.set("rating", selectedRatings.join(","));
    if (selectedYears.length) params.set("year", selectedYears.join(","));
    if (
      !selectedLangs.length &&
      !selectedGenres.length &&
      !selectedRatings.length &&
      !selectedYears.length
    ) {
      navigate("/movies/popular");
      return;
    }
    navigate(`/category?${params.toString()}`);
  };

  const handleReset = () => {
    setSelectedLangs([]);
    setSelectedGenres([]);
    setSelectedRatings([]);
    setSelectedYears([]);
  };

  const activeCount =
    selectedLangs.length +
    selectedGenres.length +
    selectedRatings.length +
    selectedYears.length;

  return (
    <div className="filter-wrapper">
      {/* Toggle button */}
      <button
        className={`filter-toggle${isOpen ? " filter-toggle--open" : ""}`}
        onClick={() => setIsOpen((v) => !v)}
        type="button"
        aria-expanded={isOpen}
        aria-controls="filter-panel"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <line x1="4"  y1="6"  x2="20" y2="6"  />
          <line x1="8"  y1="12" x2="16" y2="12" />
          <line x1="10" y1="18" x2="14" y2="18" />
        </svg>
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="filter-toggle__badge">{activeCount}</span>
        )}
        <svg
          className="filter-toggle__chevron"
          width="13" height="13" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Collapsible panel */}
      <div
        id="filter-panel"
        className={`filter-panel${isOpen ? " filter-panel--open" : ""}`}
        aria-hidden={!isOpen}
      >
        <div className="filter-panel__inner">
          {/* Language chips */}
          <div className="filter-panel__section">
            <span className="filter-panel__label">Language</span>
            <div className="filter-panel__chips">
              {LANGUAGES.map(({ label, code }) => (
                <button
                  key={code}
                  className={`filter-btn${selectedLangs.includes(code) ? " filter-btn--active" : ""}`}
                  onClick={() => toggle(selectedLangs, setSelectedLangs, code)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Genre chips */}
          <div className="filter-panel__section">
            <span className="filter-panel__label">Genre ALLL</span>
            <div className="filter-panel__chips">
              {GENRES.map(({ label, id }) => (
                <button
                  key={id}
                  className={`filter-btn${
                    selectedGenres.includes(id) ? " filter-btn--active" : ""
                  }`}
                  onClick={() =>
                    toggle(selectedGenres, setSelectedGenres, id)
                  }
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Maturity Rating chips */}
          <div className="filter-panel__section">
            <span className="filter-panel__label">Maturity Rating</span>
            <div className="filter-panel__chips">
              {RATINGS.map(({ label, code }) => (
                <button
                  key={code}
                  className={`filter-btn${
                    selectedRatings.includes(code) ? " filter-btn--active" : ""
                  }`}
                  onClick={() =>
                    toggle(selectedRatings, setSelectedRatings, code)
                  }
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Release Year chips */}
          <div className="filter-panel__section">
            <span className="filter-panel__label">Release Year</span>
            <div className="filter-panel__chips">
              {YEARS.map(({ label, code }) => (
                <button
                  key={code}
                  className={`filter-btn${
                    selectedYears.includes(code) ? " filter-btn--active" : ""
                  }`}
                  onClick={() =>
                    toggle(selectedYears, setSelectedYears, code)
                  }
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="filter-panel__actions">
            {activeCount > 0 && (
              <button className="filter-reset" onClick={handleReset} type="button">
                Reset
              </button>
            )}
            <button
              className="filter-apply"
              onClick={handleApply}
              type="button"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
