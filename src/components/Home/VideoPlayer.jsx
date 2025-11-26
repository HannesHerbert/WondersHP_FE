import "../../sass/VideoPlayer.scss";
import UseMeVid from "../../assets/videos/UseMe.mp4";

function VideoPlayer() {

//TODO: möglicherweise einstellbarer Video-Pfad im BE

  return (
    <div id="video-player">
    
      <video src={UseMeVid} controls />

    </div>
  );
}

export default VideoPlayer;
