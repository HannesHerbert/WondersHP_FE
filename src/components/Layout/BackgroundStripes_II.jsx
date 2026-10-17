import { useEffect, useRef } from "react";
import "../../sass/BackgroundStripes.scss"

const STRIPE_COUNT = 8;
// Muss zur Intro-Dauer in BackgroundStripes.scss passen (plus Puffer)
const INTRO_FALLBACK_MS = 4000;

// Jeder Streifen kennt seine Position (--i) für den zeitlich versetzten Einlauf von links nach rechts
const stripes = (props = {}) =>
  Array.from({ length: STRIPE_COUNT }, (_, i) => (
    <div
      key={i}
      className="stripe"
      style={{ "--i": i }}
      {...(i === STRIPE_COUNT - 1 ? props : {})}
    ></div>
  ));

function BackgroundStripes_II({ onIntroEnd = () => {} }) {
  const introEnded = useRef(false);

  const endIntro = () => {
    if (introEnded.current) return;
    introEnded.current = true;
    onIntroEnd();
  };

  useEffect(() => {
    // Ohne Animation sofort weiter, sonst Sicherheitsnetz falls animationend ausbleibt
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      endIntro();
      return;
    }
    // In Hintergrund-Tabs pausiert die Animation – dann erst ab Sichtbarkeit zählen
    let timer;
    const startFallback = () => {
      if (document.visibilityState !== "visible" || timer) return;
      timer = setTimeout(endIntro, INTRO_FALLBACK_MS);
    };
    startFallback();
    document.addEventListener("visibilitychange", startFallback);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", startFallback);
    };
  }, []);

  return (
    <div id="background-stripes">

      {/* <div className="stripes-container-l stripes-y">
        <div className="stripe"></div>
        <div className="stripe"></div>
        <div className="stripe"></div>
        <div className="stripe"></div>
        <div className="stripe"></div>
        <div className="stripe"></div>
        <div className="stripe"></div>
        <div className="stripe"></div>
        <div className="ol-shadow"></div>
      </div>

      <div className="stripes-container-l stripes-z">
        <div className="stripe"></div>
        <div className="stripe"></div>
        <div className="stripe"></div>
        <div className="stripe"></div>
        <div className="stripe"></div>
        <div className="stripe"></div>
        <div className="stripe"></div>
        <div className="stripe"></div>
      </div> */}

      {/* Boden: läuft von hinten nach vorn, sobald der Wand-Streifen unten angekommen ist */}
      <div className="stripes-container-r stripes-y">
        {stripes({ onAnimationEnd: endIntro })}
        <div className="ol-shadow"></div>
      </div>

      {/* Rückwand: läuft von oben nach unten */}
      <div className="stripes-container-r stripes-z">
        {stripes()}
      </div>

    </div>
  );
}

export default BackgroundStripes_II;
