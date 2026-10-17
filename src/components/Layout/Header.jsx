import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import Logo from "./Logo";
import "../../sass/Header.scss"

function Header() {
  return (
    <header id="header">
      <div className="header-inner">

        <Link to="/" id="name" aria-label="Zur Startseite">
          <Logo />
        </Link>

        <Navigation viewScope="mobile" />

      </div>
    </header>
  );
}

export default Header;
