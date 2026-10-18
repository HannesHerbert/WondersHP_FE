import "../../sass/VideoPlayer.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { mediaUrl } from "../../config.js";

// Video aus dem Dashboard (Content → Medien); ohne Auswahl das erste hochgeladene Video
function VideoPlayer() {
  const [video, setVideo] = useState(null);

  useEffect(() => {
    axios.get("/api/public/media-content")
      .then((res) => setVideo(res.data.data?.video || null))
      .catch((error) => console.error("Fehler beim Laden des Videos:", error));
  }, []);

  if (!video) return null;

  // Beschreibung nur zeigen, wenn sie mehr sagt als der Titel
  const description = video.description && video.description !== video.title ? video.description : null;

  return (
    <figure id="video-player">
      <video src={mediaUrl(video.sourceUrl)} controls preload="metadata" playsInline />
      <figcaption className="video-info">
        <h3>{video.title}</h3>
        {description && <p>{description}</p>}
      </figcaption>
    </figure>
  );
}

export default VideoPlayer;
