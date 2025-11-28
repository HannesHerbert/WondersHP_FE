import "../../sass/Footer.scss";



function Footer() {
  return (

    <div id="footer">

      <div className="footer-content">

        <div>
          <a>Datenschutz</a>
          <span>|</span>
          <Link to="/impressum">
            <p className="">Impressum</p>
          </Link>
        </div>

      <div>
        <a href="/contact" title="Zum Kontaktformular">KONTAKT & BOOKING</a>
      </div>

      <div>
        <p>Mail: <a href="mailto:ulrich.dobe@gmx.de">ulrich.dobe@gmx.de</a></p>
        <span>|</span>
        <p>Tel: <a href="tel:01743036416">0174 – 12 34 567</a></p>
      
      </div>

      </div>


    </div>

  );
}

export default Footer;
