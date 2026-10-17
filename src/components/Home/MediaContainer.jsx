import "../../sass/Media.scss";
import AudioPlayer from "./AudioPlayer";
import VideoPlayer from "./VideoPlayer";
import FlourishText from "../Snippets/FlourishText";

function Media() {
  return (
    <section id="media">
      <h2><FlourishText>Medien</FlourishText></h2>
      <div className="media-container">
        <AudioPlayer />
        <div className="separator"></div>
        <VideoPlayer />
      </div>
    </section>
  );
}

export default Media;
