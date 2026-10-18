import "../../sass/Footer.scss";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// Telefonnummer für den tel:-Link: nur Ziffern und führendes +
const telHref = (phone) => `tel:${phone.trim().startsWith("+") ? "+" : ""}${phone.replace(/\D/g, "")}`;

// Footer: E-Mail und Telefon aus dem Dashboard (Content → Footer); leer = nicht anzeigen
function Footer() {
  const [contact, setContact] = useState({ email: "", phone: "" });

  useEffect(() => {
    const load = () =>
      axios.get("/api/public/footer")
        .then((res) => setContact(res.data.data || { email: "", phone: "" }))
        .catch(() => {});
    load();
    window.addEventListener("footer-content-updated", load);
    return () => window.removeEventListener("footer-content-updated", load);
  }, []);

  const { email, phone } = contact;

  return (
    <footer id="footer">
      <div className="footer-content">

        <div className="footer-legal">
          <Link to="/datenschutz">Datenschutz</Link>
          <span className="footer-dot" aria-hidden="true"></span>
          <Link to="/impressum">Impressum</Link>
        </div>

        <div className="footer-cta">
          <Link to="/contact" title="Zum Kontaktformular">Kontakt &amp; Booking</Link>
        </div>

        {(email || phone) && (
          <div className="footer-contact">
            {email && <a href={`mailto:${email}`}>{email}</a>}
            {email && phone && <span className="footer-dot" aria-hidden="true"></span>}
            {phone && <a href={telHref(phone)}>{phone}</a>}
          </div>
        )}

      </div>
    </footer>
  );
}

export default Footer;
