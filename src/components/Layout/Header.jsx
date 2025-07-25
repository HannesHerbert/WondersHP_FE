import Navigation from "./Navigation";
import AudioPlayer from "../Home/AudioPlayer";
import "../../sass/Header.scss"

function Header() {
  return (
    <header id="header">
      <div>
        <Navigation viewScope="mobile" />

        <div id="name">
          <span>Jody Cooper &</span>
          <span>the Wonders</span>
        </div>

      </div>

    </header>
  );
}

export default Header;
