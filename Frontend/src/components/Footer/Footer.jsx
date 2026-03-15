import { Link } from "react-router-dom";
import "./footer.scss";

const Footer = () => {
  const year = new Date().getFullYear();

  const linkGroups = [
    {
      title: "Browse",
      links: [
        { label: "Trending", to: "/movies/trending" },
        { label: "Popular", to: "/movies/popular" },
        { label: "Top Rated", to: "/movies/top-rated" },
        { label: "TV Shows", to: "/category?type=tv" },
      ],
    },
    {
      title: "Explore",
      links: [
        { label: "Home", to: "/" },
        { label: "Search", to: "/search" },
        ],
    },
    {
      title: "Library",
      links: [
        { label: "Favorites", to: "/favorites" },
        { label: "Watchlist", to: "/watchlist" },
        { label: "History", to: "/history" },
      ],
    },
  ];

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer__content">
        <div className="footer__top">
          <Link to="/" className="footer__brand" aria-label="MovieZilla home">
            MovieZilla
          </Link>

          <nav className="footer__nav" aria-label="Quick links">
            {linkGroups.map((group) => (
              <div key={group.title} className="footer__group">
                <h3 className="footer__heading">{group.title}</h3>
                {group.links.map((link) => (
                  <Link key={link.to} to={link.to} className="footer__link">
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">&copy; {year} MovieZilla. All rights reserved.</p>
          <span className="footer__watermark" aria-hidden="true">MovieZilla</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;