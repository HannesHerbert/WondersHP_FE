import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import HeaderLogo from "./HeaderLogo";
import SocialLinks from "./SocialLinks";
import "../../sass/Header.scss"

function Header() {
  return (
    <header id="header">
      <div className="header-inner">

        <Link to="/" id="name" aria-label="Zur Startseite">
          <HeaderLogo />
        </Link>

        <div className="header-actions">
          <SocialLinks />
          <Navigation viewScope="mobile" />
        </div>

      </div>
    </header>
  );
}

export default Header;
