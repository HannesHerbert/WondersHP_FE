import { useLayoutEffect, useEffect, useRef, useState } from "react";
import "../../sass/FlourishText.scss";

// Unterstreichung für Überschriften und Navigation: ein Strich, der unter dem Text von links nach
// rechts gezeichnet wird, über den Text hinausläuft und rechts in einer kleinen Spirale endet.
// Alle Maße hängen an der Schriftgröße, damit es bei jeder Größe gleich aussieht.
const CURL_EM = 0.36; // Startradius der Spirale – Durchmesser reicht bis in die Höhe der Buchstaben
const CURL_TURNS = 1.35; // Windungen der Spirale
const CLEARANCE_EM = 0.12; // Abstand zwischen Textende und linkestem Punkt der Spirale
const LIFT_EM = 0.1; // Strich rückt so weit nach oben an den Text (in den Unterlängen-Bereich)

/** Spiralpunkte relativ zum Mittelpunkt: Start unten, gegen den Uhrzeigersinn nach innen */
function spiralPoints(r0) {
  const steps = 72;
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const angle = Math.PI / 2 - t * CURL_TURNS * Math.PI * 2;
    const radius = r0 * (1 - 0.72 * t);
    return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
  });
}

/** Pfad: gerade Linie unter dem Text, dann eine Spirale, die erst hinter dem Textende nach oben aufrollt */
function buildPath(textWidth, fontSize, strokeWidth) {
  const r0 = fontSize * CURL_EM;
  const half = strokeWidth / 2;
  const baseY = 2 * r0 + half; // Linie liegt unten, die Spirale rollt nach oben
  const spiral = spiralPoints(r0);

  // Mittelpunkt so setzen, dass auch der linkeste Spiralpunkt noch rechts vom Text liegt
  const leftmost = Math.min(...spiral.map((p) => p.x));
  const centerX = half + textWidth + fontSize * CLEARANCE_EM - leftmost;
  const centerY = baseY - r0;
  const points = spiral.map((p) => `${(centerX + p.x).toFixed(2)} ${(centerY + p.y).toFixed(2)}`);

  return {
    d: `M ${half} ${baseY.toFixed(2)} H ${centerX.toFixed(2)} L ${points.join(" L ")}`,
    width: centerX + r0 + strokeWidth,
    height: baseY + half,
  };
}

/**
 * @param {boolean} drawOnView  true: zeichnet sich einmal, sobald der Text ins Bild kommt (Überschriften).
 *                              false: Zustand steuert CSS über die Eltern (z.B. Hover/aktiver Nav-Punkt).
 */
function FlourishText({ children, drawOnView = true, strokeWidth = 3 }) {
  const wrapperRef = useRef(null);
  const labelRef = useRef(null);
  const pathRef = useRef(null);
  const [geometry, setGeometry] = useState(null);
  const [drawn, setDrawn] = useState(false);

  // Breite und Schriftgröße messen; bei Größenänderung neu
  useLayoutEffect(() => {
    const label = labelRef.current;
    if (!label) return;

    const measure = () => {
      const fontSize = parseFloat(getComputedStyle(label).fontSize) || 16;
      // offsetWidth statt getBoundingClientRect: unabhängig von Transformationen (z.B. 3D-gekippte Navigation)
      setGeometry({ ...buildPath(label.offsetWidth, fontSize, strokeWidth), fontSize });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(label);
    // Webfont (Righteous) ändert die Textbreite, sobald sie geladen ist
    let active = true;
    document.fonts?.ready.then(() => active && measure());
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [strokeWidth]);

  // Pfadlänge für das Zeichnen per stroke-dashoffset
  useLayoutEffect(() => {
    const path = pathRef.current;
    if (path) wrapperRef.current.style.setProperty("--flourish-length", path.getTotalLength().toFixed(1));
  }, [geometry]);

  useEffect(() => {
    if (!drawOnView || drawn) return;
    const el = wrapperRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setDrawn(true);
        observer.disconnect();
      }
    }, { threshold: 0.6 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [drawOnView, drawn]);

  // Nur Platz für den Strich selbst reservieren – die Spirale ragt nach oben in die Textzeile hinein.
  // Die Linie liegt LIFT_EM über der Unterkante des Textes.
  const lift = geometry ? geometry.fontSize * LIFT_EM : 0;
  const reserve = Math.max(0, strokeWidth - lift);
  const svgBottom = reserve - strokeWidth / 2 + lift;

  return (
    <span
      ref={wrapperRef}
      className={`flourish${drawn ? " is-drawn" : ""}`}
      style={geometry ? { paddingBottom: reserve } : undefined}
    >
      <span ref={labelRef} className="flourish-label">{children}</span>
      {geometry && (
        <svg
          className="flourish-line"
          style={{ bottom: svgBottom }}
          width={geometry.width}
          height={geometry.height}
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          aria-hidden="true"
          focusable="false"
        >
          <path ref={pathRef} d={geometry.d} strokeWidth={strokeWidth} />
        </svg>
      )}
    </span>
  );
}

export default FlourishText;
