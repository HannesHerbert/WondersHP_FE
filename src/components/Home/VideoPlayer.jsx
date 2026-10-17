import "../../sass/VideoPlayer.scss";


function VideoPlayer() {

//TODO: möglicherweise einstellbarer Video-Pfad im BE

  return (
    <div id="video-player">


      <video controls />

      <div className="corner top left"></div>
      <div className="corner top right"></div>
      <div className="corner bottom left"></div>
      <div className="corner bottom right"></div>

      <div className="video-info">
        <h3>Use Me</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          sollicitudin, nunc sit amet varius facilisis, nisl nunc consectetur
          nisi, euismod aliquam nisl nunc euismod nisi. Donec sollicitudin,
          nunc sit amet varius facilisis, nisl nunc consectetur nisi, euismod
          aliquam nisl nunc euismod nisi.
        </p>
      </div>

    </div>
  );
}

export default VideoPlayer;
