import "../../sass/Footer.scss";
import { Link } from 'react-router-dom';


function Footer() {
  return (

    <footer id="footer">

      <div className="footer-content">

        <div className="footer-legal">
          <a>Datenschutz</a>
          <span className="footer-dot" aria-hidden="true"></span>
          <Link to="/impressum">Impressum</Link>
        </div>

        <div className="footer-cta">
          <Link to="/contact" title="Zum Kontaktformular">Kontakt &amp; Booking</Link>
        </div>

        <div className="footer-contact">
          <a href="mailto:ulrich.dobe@gmx.de">ulrich.dobe@gmx.de</a>
          <span className="footer-dot" aria-hidden="true"></span>
          <a href="tel:01743036416">0174 – 12 34 567</a>
        </div>

      </div>

    </footer>

  );
}

export default Footer;
