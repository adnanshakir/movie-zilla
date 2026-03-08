import "./footer.scss";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <span className="footer__watermark" aria-hidden="true">
        MOVIEZILLA
      </span>

      <span className="footer__copy">
        &copy; {year} MovieZilla. All rights reserved.
      </span>
    </footer>
  );
};

export default Footer;