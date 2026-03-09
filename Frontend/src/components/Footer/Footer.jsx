import "./footer.scss";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <span className="footer__watermark" aria-hidden="true">
        MOVIEZILLA
      </span>

      <div className="footer__content">
        <nav className="footer__social" aria-label="Social links">
          <a href="#" className="footer__link">X</a>
          <a href="#" className="footer__link">LinkedIn</a>
          <a href="#" className="footer__link">GitHub</a>
        </nav>
        <p className="footer__copy">
          &copy; {year} MovieZilla. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;