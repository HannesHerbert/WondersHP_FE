import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import VideoEmbed from "../Snippets/VideoEmbed";
import "../../sass/GalleryVideos.scss";

const SLIDE_MS = 450; // muss zu $slide_ms in GalleryVideos.scss passen

// Galerie oben: alle freigegebenen Videos (Dashboard → Medien). Bei mehreren Pfeile und Punkte zum Blättern;
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

  // Zu einem Video wechseln; direction bestimmt die Gleitrichtung (1 = nach links hinaus)
  function goTo(target, step) {
    if (videos.length < 2 || target === index) return;
    // Laufendes Video anhalten, bevor es hinausgleitet
    stageRef.current?.querySelector(".gv-slide.current video")?.pause();
    clearTimeout(timer.current);
    setLeaving({ index, direction: step });
    setDirection(step);
    setIndex(target);
    timer.current = setTimeout(() => setLeaving(null), SLIDE_MS);
  }

  const go = (step) => goTo((index + step + videos.length) % videos.length, step);

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

      {/* Unter dem Video: Pfeile mit einem Punkt je Video dazwischen */}
      {hasMore && (
        <div className="gv-nav">
          <button type="button" className="gv-arrow prev" onClick={() => go(-1)} aria-label="Vorheriges Video">
            <FaChevronLeft aria-hidden="true" />
          </button>
          <div className="gv-dots" role="group" aria-label="Video wählen">
            {videos.map((video, i) => (
              <button
                key={video.id}
                type="button"
                className={`gv-dot${i === index ? " active" : ""}`}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                aria-label={`Video ${i + 1}: ${video.title}`}
                aria-current={i === index || undefined}
              />
            ))}
          </div>
          <button type="button" className="gv-arrow next" onClick={() => go(1)} aria-label="Nächstes Video">
            <FaChevronRight aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

export default GalleryVideos;
