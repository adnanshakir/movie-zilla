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

const Filters = ({ initialLangs = [], initialGenres = [] }) => {
  const navigate = useNavigate();
  // Keep filter panel initially closed on all devices.
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLangs, setSelectedLangs]   = useState(initialLangs);
  const [selectedGenres, setSelectedGenres] = useState(initialGenres);

  const toggle = (list, setList, value) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    if (selectedLangs.length)  params.set("lang",  selectedLangs.join(","));
    if (selectedGenres.length) params.set("genre", selectedGenres.join(","));
    if (!selectedLangs.length && !selectedGenres.length) {
      navigate("/movies/popular");
      return;
    }
    navigate(`/category?${params.toString()}`);
  };

  const handleReset = () => {
    setSelectedLangs([]);
    setSelectedGenres([]);
  };

  const activeCount = selectedLangs.length + selectedGenres.length;

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
            <span className="filter-panel__label">Genre</span>
            <div className="filter-panel__chips">
              {GENRES.map(({ label, id }) => (
                <button
                  key={id}
                  className={`filter-btn${selectedGenres.includes(id) ? " filter-btn--active" : ""}`}
                  onClick={() => toggle(selectedGenres, setSelectedGenres, id)}
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
