import { Link, NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "./navbar.scss";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";

const SunIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
  </svg>
);

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const isLoggedIn = localStorage.getItem("user");
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          MovieZilla
        </Link>

        {isLoggedIn && (
          <div className="navbar__links">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `navbar__link${isActive ? " active" : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `navbar__link${isActive ? " active" : ""}`
              }
            >
              Favorites
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `navbar__link${isActive ? " active" : ""}`
              }
            >
              History
            </NavLink>
          </div>
        )}

        <div className="navbar__actions">
          {isLanding && !isLoggedIn && (
            <>
              <Link to="/login" className="btn btn--outline btn--sm">
                Login
              </Link>
              <Link to="/register" className="btn btn--primary btn--sm">
                Sign Up
              </Link>
            </>
          )}
          {isLoggedIn && (
            <button className="btn btn--outline btn--sm" onClick={handleLogout}>
              Logout
            </button>
          )}

          <button
            className="navbar__toggle"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {isLoggedIn && (
            <button
              className="navbar__menu-btn"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {isLoggedIn && (
        <div className={`navbar__mobile-menu${isMenuOpen ? " open" : ""}`}>
          <NavLink
            to="/home"
            className={({ isActive }) => `navbar__mobile-link${isActive ? " active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) => `navbar__mobile-link${isActive ? " active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Favorites
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) => `navbar__mobile-link${isActive ? " active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            History
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
