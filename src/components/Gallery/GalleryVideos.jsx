import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import VideoEmbed from "../Snippets/VideoEmbed";
import "../../sass/GalleryVideos.scss";

const SLIDE_MS = 450; // muss zu $slide_ms in GalleryVideos.scss passen

// Galerie oben: alle freigegebenen Videos (Dashboard → Medien). Bei mehreren Pfeile zum Blättern;
// altes Video gleitet in Pfeilrichtung hinaus, das neue mit derselben Bewegung herein.
function GalleryVideos() {
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(null); // { index, direction }
  const [direction, setDirection] = useState(1);
  const stageRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    axios.get("/api/public/videos")
      .then((res) => setVideos(res.data.data || []))
      .catch(() => setVideos([]));
    return () => clearTimeout(timer.current);
  }, []);

  function go(step) {
    if (videos.length < 2) return;
    // Laufendes Video anhalten, bevor es hinausgleitet
    stageRef.current?.querySelector(".gv-slide.current video")?.pause();
    clearTimeout(timer.current);
    setLeaving({ index, direction: step });
    setDirection(step);
    setIndex((i) => (i + step + videos.length) % videos.length);
    timer.current = setTimeout(() => setLeaving(null), SLIDE_MS);
  }

  if (videos.length === 0) return null;

  const renderSlide = (i, className) => {
    const video = videos[i];
    const description = video.description && video.description !== video.title ? video.description : null;
    return (
      // Key nur nach Rolle (raus/aktuell), damit das aktuelle Video nach dem Hereingleiten nicht neu startet
      <figure key={`${video.id}-${className.startsWith("out") ? "out" : "current"}`} className={`gv-slide ${className}`} aria-hidden={className.startsWith("out") || undefined}>
        <VideoEmbed video={video} />
        <figcaption>
          <h3>{video.title}</h3>
          {description && <p>{description}</p>}
        </figcaption>
      </figure>
    );
  };

  const hasMore = videos.length > 1;

  return (
    <div id="gallery-videos" className={hasMore ? "has-more" : ""}>
      <div className="gv-stage" ref={stageRef} aria-live="polite">
        {leaving && renderSlide(leaving.index, `out ${leaving.direction > 0 ? "to-left" : "to-right"}`)}
        {renderSlide(index, `current${leaving ? ` in ${direction > 0 ? "from-right" : "from-left"}` : ""}`)}
      </div>

      {hasMore && (
        <>
          <button type="button" className="gv-arrow prev" onClick={() => go(-1)} aria-label="Vorheriges Video">
            <FaChevronLeft aria-hidden="true" />
          </button>
          <button type="button" className="gv-arrow next" onClick={() => go(1)} aria-label="Nächstes Video">
            <FaChevronRight aria-hidden="true" />
          </button>
          <p className="gv-counter">Video {index + 1} von {videos.length}</p>
        </>
      )}
    </div>
  );
}

export default GalleryVideos;
