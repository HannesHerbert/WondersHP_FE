import { useState } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaYoutube } from "react-icons/fa";
import { mediaUrl } from "../../config.js";
import "../../sass/VideoEmbed.scss";

/**
 * Ein Video – lokal (eigene Datei) oder von YouTube.
 * YouTube mit Zwei-Klick-Lösung: zuerst nur das lokal gespeicherte Vorschaubild, erst nach Klick
 * wird der Player von youtube-nocookie.com geladen (vorher keine Verbindung zu YouTube).
 */
function VideoEmbed({ video, className = "" }) {
  const [consented, setConsented] = useState(false);

  if (video.provider !== "youtube") {
    return <video className={className} src={mediaUrl(video.sourceUrl)} controls preload="metadata" playsInline />;
  }

  if (consented) {
    const params = new URLSearchParams({ autoplay: "1", rel: "0", modestbranding: "1", playsinline: "1" });
    return (
      <iframe
        className={`video-embed-frame ${className}`.trim()}
        src={`https://www.youtube-nocookie.com/embed/${video.externalId}?${params}`}
        title={video.title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  return (
    <div className={`video-embed-consent ${className}`.trim()}>
      {video.posterUrl && <img src={mediaUrl(video.posterUrl)} alt="" loading="lazy" />}
      <div className="video-embed-overlay">
        <button type="button" className="video-embed-play" onClick={() => setConsented(true)} aria-label={`„${video.title}“ von YouTube abspielen`}>
          <FaPlay aria-hidden="true" />
        </button>
        <p>
          <FaYoutube aria-hidden="true" /> Beim Abspielen werden Daten an YouTube übertragen.{" "}
          <Link to="/datenschutz" onClick={(e) => e.stopPropagation()}>Mehr dazu</Link>
        </p>
      </div>
    </div>
  );
}

export default VideoEmbed;
