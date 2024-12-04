import Navigation from "./Navigation";
import AudioPlayer from "../components/Home/AudioPlayer";
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

      {/* <AudioPlayer /> */}

    </header>
  );
}

export default Header;
