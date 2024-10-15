import Navigation from "./Navigation";
import "../sass/Header.scss"

function Header() {
  return (
    <header id="header">
      <div>
        <Navigation viewScope="mobile" />

        <div id="name">
          Jody
          <br />
          Cooper
          <br />
          & the
          <br />
          Wonders
        </div>
      </div>
    </header>
  );
}

export default Header;
