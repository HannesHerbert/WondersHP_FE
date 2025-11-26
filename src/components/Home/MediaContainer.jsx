import "../../sass/Media.scss";
import AudioPlayer from "./AudioPlayer";
import VideoPlayer from "./VideoPlayer";

function Media() {
  return (
    <section id="media">
      <h2>Medien</h2>
      <div className="media-container">
        <AudioPlayer />
        <div className="separator"></div>
        <VideoPlayer />
      </div>
    </section>
  );
}

export default Media;
