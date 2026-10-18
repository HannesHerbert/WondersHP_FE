import "../../sass/Members.scss";
import { useState, useEffect, useRef, useLayoutEffect, useMemo } from "react";
import axios from "axios";
import Image from "../Snippets/Image";
import { createShape, blendShapes, targetParams, lerpParams, buildFrame, orderClockwise } from "./membersLayout";
import { sanitizeRichText } from "../../services/richText";

// Overlay-Farbe (Index in $colors) je Ecke der Stammbesetzung; Gäste nutzen die übrigen Farben
const POSITION_COLORS = { 1: 1, 2: 5, 3: 6, 4: 7 };
const GUEST_COLORS = [2, 3, 4, 8];

const MOVE_MS = 550;
// Beim Zuklappen erst Text ausblenden, dann zusammenfalten (wie im alten 2x2-Grid)
const COLLAPSE_DELAY_MS = 250;
const ease = (t) => 1 - Math.pow(1 - t, 3);

const getMembersNameSquared = (array) => {
  let maxNameLength = 0;
  (array || []).forEach((member) => {
    const nameLength = (member.firstname?.length || 0) + (member.lastname?.length || 0);
    if (nameLength > maxNameLength) maxNameLength = nameLength;
  });

  let i = 0;
  while (true) {
    i++;
    if (maxNameLength + 1 < i * i) return i * i;
  }
};

const px = (rect) => ({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });

function Members() {

  const [membersArr, setMembersArr] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  // Zuletzt geöffnete Kachel bleibt beim Zuklappen über den anderen
  const [lastExpandedId, setLastExpandedId] = useState(null);
  const [guestsShown, setGuestsShown] = useState(false);
  const [gridWidth, setGridWidth] = useState(0);
  const gridRef = useRef(null);

  // Aktueller Animationsstand: Form + Winkel je Mitglied. Ein einziger rAF-Loop treibt alles an.
  const stateRef = useRef(null);
  const [, setFrameCount] = useState(0);

  const getAllMembers = async () => {
    try {
      let res = await axios.get(`/api/public/members`);
      setMembersArr(res.data.data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Mitglieder:', error);
      setMembersArr([]);
    }
  };

  useEffect(() => {
    getAllMembers();
  }, []);

  // Geometrie hängt von der echten Breite ab (40vw bzw. 80vw mobil)
  useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    setGridWidth(el.clientWidth);
    const observer = new ResizeObserver(([entry]) => setGridWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const core = membersArr.filter((m) => !m.isGuest);
  const guests = membersArr
    .filter((m) => m.isGuest)
    .sort((a, b) => a.image_position - b.image_position);
  const visible = orderClockwise(core, guestsShown ? guests : []);

  const toggleGuests = () => {
    // Geöffnete Gast-Kachel vorher schließen, sonst bliebe sie ohne Platz offen
    if (guestsShown && guests.some((g) => g.id === expandedId)) setExpandedId(null);
    setGuestsShown((shown) => !shown);
  };

  // Beschreibungen dürfen HTML (v.a. Links) enthalten – einmal bereinigen, nicht in jedem Animations-Frame
  const descriptionsHtml = useMemo(
    () => Object.fromEntries(membersArr.map((m) => [m.id, sanitizeRichText(m.description)])),
    [membersArr]
  );

  const toggleDescription = (id) => {
    setLastExpandedId(id);
    setExpandedId((current) => (current === id ? null : id));
  };

  const targetKey = `${gridWidth}|${visible.map((m) => m.id).join(",")}|${membersArr.length}|${expandedId}`;

  useLayoutEffect(() => {
    if (!gridWidth || !membersArr.length) return;

    const target = {
      width: gridWidth,
      shape: createShape(visible.length, gridWidth),
      params: targetParams(membersArr, visible, expandedId),
    };
    const current = stateRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Erster Aufbau, Größenänderung oder kein sichtbarer Tab: ohne Animation springen
    if (!current || current.width !== gridWidth || reduceMotion || document.hidden) {
      stateRef.current = target;
      setFrameCount((c) => c + 1);
      return;
    }

    const isCollapsing = Object.entries(current.params).some(([id, p]) => p.e > 0.5 && target.params[id]?.e === 0);
    const startAt = performance.now() + (isCollapsing ? COLLAPSE_DELAY_MS : 0);
    const from = current;
    let frame;

    const tick = (now) => {
      const progress = Math.min(Math.max((now - startAt) / MOVE_MS, 0), 1);
      const k = ease(progress);
      stateRef.current = progress < 1
        ? { width: gridWidth, shape: blendShapes(from.shape, target.shape, k), params: lerpParams(from.params, target.params, k) }
        : target;
      setFrameCount((c) => c + 1);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    // Unterbrechung: der nächste Lauf startet vom zuletzt gezeichneten Stand
    return () => cancelAnimationFrame(frame);
  }, [targetKey]);

  const membersNamesLength = getMembersNameSquared(membersArr);
  const nameGridSide = Math.sqrt(membersNamesLength);
  const frame = stateRef.current && buildFrame(stateRef.current.shape, stateRef.current.params);

  const membersElements = frame && membersArr.map((member) => {
    const parts = frame.tiles[member.id];
    if (!parts) return null;

    const fullNameLength = (member.firstname?.length || 0) + (member.lastname?.length || 0);
    const emptyDivsCount = membersNamesLength - fullNameLength;
    const isExpanded = member.id === expandedId;
    const isHidden = !visible.includes(member);
    const color = member.isGuest
      ? GUEST_COLORS[guests.indexOf(member) % GUEST_COLORS.length]
      : POSITION_COLORS[member.image_position] || 1;

    const classes = [
      "member",
      `color-${color}`,
      isExpanded && "expanded",
      isHidden && "hidden-guest",
      member.id === lastExpandedId && "last-expanded",
    ].filter(Boolean).join(" ");

    return (
      <div
        key={member.id}
        className={classes}
        style={{ clipPath: parts.clip }}
        onClick={(event) => {
          // Klick auf einen Link in der Beschreibung soll die Ansicht nicht zuklappen
          if (isHidden || event.target.closest("a")) return;
          toggleDescription(member.id);
        }}
        aria-hidden={isHidden || undefined}
      >

        {/* Bild bleibt immer im eigenen Ausschnitt (Dreieck bzw. Viertel) */}
        <div className="member-image" style={{ clipPath: parts.imageClip }}>
          <div className="member-photo" style={px(parts.image)}>
            <Image imageObject={{
              images: member.images,
              altText: `${member.firstname} ${member.lastname}`.trim(),
              className: "member-img-element"
            }} />
          </div>
        </div>

        {/* Overlay und Name: zu im eigenen Ausschnitt, offen im Nachbar-Ausschnitt */}
        <div className="image-overlay" style={{ clipPath: parts.overlayClip }}></div>
        <div
          className="member-name"
          style={{
            ...px(parts.name),
            "--name-box": `${100 / nameGridSide}%`,
            "--name-font": `${(parts.nameSize / nameGridSide) * 0.8}px`,
          }}
        >
          {(member.firstname || "").split("").map((letter, i) => (
            <div key={`firstname-${i}`} className="name-box">
              {letter}
            </div>
          ))}

          {Array(emptyDivsCount > 0 ? emptyDivsCount : 0)
            .fill(null)
            .map((_, i) => (
              <div key={`empty-${i}`} className="name-box">
                _
              </div>
            ))}

          {(member.lastname || "").split("").map((letter, i) => (
            <div key={`lastname-${i}`} className="name-box">
              {letter}
            </div>
          ))}
        </div>
        <div className="member-description" style={px(parts.description)}>
          <div className="description-text" dangerouslySetInnerHTML={{ __html: descriptionsHtml[member.id] }}></div>
        </div>
      </div>
    );
  });

  return (
    <section id="members">
      <div
        className="members-grid"
        ref={gridRef}
        style={{ height: frame ? frame.height : undefined }}
      >
        {frame && (
          <>
            {/* Rahmen und Fläche folgen der Form (Quadrat bzw. N-Eck) */}
            <div className="members-frame" style={{ clipPath: frame.frame }}></div>
            <div className="members-surface" style={{ clipPath: frame.surface }}></div>
            {membersElements}
          </>
        )}
      </div>

      {guests.length > 0 && (
        <button
          type="button"
          className={`members-cta${guestsShown ? " open" : ""}`}
          onClick={toggleGuests}
          aria-expanded={guestsShown}
        >
          <span>{guestsShown ? "Special Guests ausblenden" : "Special Guests anzeigen"}</span>
          <span className="members-cta-icon" aria-hidden="true">+</span>
        </button>
      )}
    </section>
  );
}

export default Members;
