import "../../sass/BookingTeaser.scss";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { mediaUrl } from "../../config.js";

// Endvergrößerung: das Auge füllt dann etwa die Bühne
const MAX_ZOOM = 28;
// Zoombereich, in dem der runde "Hier anfragen"-Button über dem Zoompunkt erscheint
const CTA_FROM = 3;
const CTA_TO = 8;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function BookingTeaser() {
  const [teaser, setTeaser] = useState(null);
  const sceneRef = useRef(null);
  const stageRef = useRef(null);
  const photoRef = useRef(null);
  const veilRef = useRef(null);
  const detailRefs = useRef([]);
  const ctaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/public/booking-teaser")
      .then((res) => setTeaser(res.data.data))
      .catch((error) => console.error("Fehler beim Laden des Buchungs-Teasers:", error));
  }, []);

  // Scroll-Fortschritt durch die Szene → Zoom in den Fokuspunkt (direkt am DOM, ohne Re-Render)
  useEffect(() => {
    const scene = sceneRef.current;
    const stage = stageRef.current;
    const photo = photoRef.current;
    const cta = ctaRef.current;
    if (!teaser || !scene || !stage || !photo || !cta) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Ohne Zoom: Button gleich sichtbar über dem Zoompunkt
      cta.style.opacity = 1;
      cta.style.pointerEvents = "auto";
      return;
    }

    const scroller = scene.closest("#content-outlet") || window;
    const { focusX, focusY } = teaser;
    let frame = null;

    const update = () => {
      frame = null;
      // Solange die Bühne klebt, wandert sie innerhalb der Szene von 0 bis `range` nach unten
      const range = scene.offsetHeight - stage.offsetHeight;
      const travelled = stage.getBoundingClientRect().top - scene.getBoundingClientRect().top;
      const progress = range > 0 ? clamp(travelled / range, 0, 1) : 0;

      // Exponentiell skalieren, damit der Zoom gleichmäßig wirkt; Fokuspunkt wandert früh in die Mitte
      const scale = Math.pow(MAX_ZOOM, progress);
      const center = Math.min(1, progress * 1.6);
      photo.style.transform =
        `translate(${(50 - focusX) * center}%, ${(50 - focusY) * center}%) scale(${scale})`;
      // Je stärker der Zoom, desto feinere (höher aufgelöste) Detail-Ebene einblenden
      (teaser.details || []).forEach((layer, i) => {
        const el = detailRefs.current[i];
        if (el) el.style.opacity = clamp((scale - layer.from) / (layer.to - layer.from), 0, 1);
      });
      // Zum Ende hin abdunkeln – man "taucht" ins Auge ein
      veilRef.current.style.opacity = Math.pow(progress, 3) * 0.85;

      // Der Zoompunkt bleibt beim Skalieren fest (transform-origin) und wandert nur durch das Verschieben
      const appear = clamp((scale - CTA_FROM) / (CTA_TO - CTA_FROM), 0, 1);
      cta.style.left = `${focusX + (50 - focusX) * center}%`;
      cta.style.top = `${focusY + (50 - focusY) * center}%`;
      cta.style.opacity = appear;
      cta.style.transform = `translate(-50%, -50%) scale(${0.6 + 0.4 * appear})`;
      cta.style.pointerEvents = appear > 0.5 ? "auto" : "none";
      cta.tabIndex = appear > 0.5 ? 0 : -1;
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [teaser]);

  if (!teaser?.images) return null;

  const baseUrl = mediaUrl("/media/images/");
  const { images, focusX, focusY, title, details = [] } = teaser;

  return (
    <section id="booking-teaser" ref={sceneRef}>
      <div className="booking-stage" ref={stageRef}>
        <h2>
          <Link to="/contact">{title}</Link>
        </h2>

        {/* Ganzes Bild führt zur Anfrage; der runde Button ist der sichtbare Einstieg beim Zoomen */}
        <div className="booking-frame" onClick={() => navigate("/contact")}>
          <div
            ref={photoRef}
            className="booking-photo"
            style={{ transformOrigin: `${focusX}% ${focusY}%` }}
          >
            <img
              src={baseUrl + images.lg}
              srcSet={`${baseUrl + images.sm} 300w, ${baseUrl + images.md} 800w, ${baseUrl + images.lg} 1920w`}
              sizes="(max-width: 760px) 100vw, 1200px"
              alt="Jody Cooper & the Wonders"
              loading="lazy"
            />
            {/* Hochskalierte, geschärfte Ausschnitte um den Zoompunkt – liegen deckungsgleich über dem Foto */}
            {details.map((layer, i) => (
              <img
                key={layer.file}
                ref={(el) => { detailRefs.current[i] = el; }}
                className="booking-detail"
                src={baseUrl + layer.file}
                alt=""
                aria-hidden="true"
                decoding="async"
                style={{ left: `${layer.x}%`, top: `${layer.y}%`, width: `${layer.w}%`, height: `${layer.h}%` }}
              />
            ))}
          </div>
          <div className="booking-veil" ref={veilRef}></div>

          <Link
            to="/contact"
            className="booking-cta"
            ref={ctaRef}
            tabIndex={-1}
            style={{ left: `${focusX}%`, top: `${focusY}%` }}
            onClick={(event) => event.stopPropagation()}
          >
            Hier anfragen
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BookingTeaser;
