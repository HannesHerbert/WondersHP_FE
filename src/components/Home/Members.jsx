import "../../sass/Members.scss";
import { useState, useEffect, useRef, useLayoutEffect, useMemo } from "react";
import axios from "axios";
import Image from "../Snippets/Image";
import { createShape, blendShapes, targetParams, lerpParams, buildFrame, sortByPosition, photoTransform } from "./membersLayout";
import { sanitizeRichText } from "../../services/richText";
import MemberDescription from "./MemberDescription";

// Overlay-Farbe (Index in $colors) je Platz im Uhrzeigersinn: die beiden ersten und letzten Plätze
// behalten die Farben der früheren 2x2-Ecken, alle dazwischen wechseln durch die übrigen Farben
const MIDDLE_COLORS = [2, 3, 4, 8];
function colorAt(index, count) {
  if (index === count - 1 && count > 1) return 1;
  if (index === count - 2 && count >= 4) return 6;
  if (index === 0) return 5;
  if (index === 1) return 7;
  return MIDDLE_COLORS[(index - 2) % MIDDLE_COLORS.length];
}

const MOVE_MS = 550;
// Abstand des Beschreibungstextes zu Rand, Bild und Name (wächst mit der Grid-Breite)
const textMargin = (gridWidth) => Math.min(10, Math.max(4, gridWidth * 0.02));
// Beim Zuklappen erst Text ausblenden, dann zusammenfalten (wie im alten 2x2-Grid)
const COLLAPSE_DELAY_MS = 250;
const ease = (t) => 1 - Math.pow(1 - t, 3);

// Längster Vor- bzw. Nachname bestimmt die Schriftgröße, damit alle Namen in ihre Ecke passen
const longestNamePart = (members) =>
  Math.max(4, ...members.flatMap((m) => [m.firstname?.length || 0, m.lastname?.length || 0]));

const px = (rect) => ({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });

function Members() {

  const [membersArr, setMembersArr] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  // Zuletzt geöffnete Kachel bleibt beim Zuklappen über den anderen
  const [lastExpandedId, setLastExpandedId] = useState(null);
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

  // Alle Mitglieder im Uhrzeigersinn ab oben, Reihenfolge aus dem Dashboard (Position 1, 2, 3, …)
  const visible = useMemo(() => sortByPosition(membersArr), [membersArr]);

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

  // Endzustand der Form: daraus die freie Fläche für den Text des geöffneten Mitglieds
  const targetFrame = useMemo(() => {
    if (!gridWidth || !membersArr.length) return null;
    return buildFrame(createShape(visible.length, gridWidth), targetParams(membersArr, visible, expandedId));
  }, [targetKey]);

  const descriptionBands = useMemo(() => {
    const tile = expandedId != null && targetFrame?.tiles[expandedId];
    if (!tile) return null;
    const margin = textMargin(gridWidth);
    return (y0, y1) => targetFrame.freeIntervals(y0, y1, tile.obstacles, margin);
  }, [targetFrame, expandedId]);

  const longestName = longestNamePart(membersArr);
  const frame = stateRef.current && buildFrame(stateRef.current.shape, stateRef.current.params);

  const membersElements = frame && membersArr.map((member) => {
    const parts = frame.tiles[member.id];
    if (!parts) return null;

    const isExpanded = member.id === expandedId;
    const color = colorAt(visible.indexOf(member), visible.length);

    const classes = [
      "member",
      `color-${color}`,
      isExpanded && "expanded",
      member.id === lastExpandedId && "last-expanded",
    ].filter(Boolean).join(" ");

    return (
      <div
        key={member.id}
        className={classes}
        style={{ clipPath: parts.clip }}
        onClick={(event) => {
          // Klick auf einen Link in der Beschreibung soll die Ansicht nicht zuklappen
          if (event.target.closest("a")) return;
          toggleDescription(member.id);
        }}
      >

        {/* Bild bleibt immer im eigenen Ausschnitt (Dreieck bzw. Viertel) */}
        <div className="member-image" style={{ clipPath: parts.imageClip }}>
          <div className="member-photo" style={px(parts.image)}>
            <Image imageObject={{
              images: member.images,
              altText: `${member.firstname} ${member.lastname}`.trim(),
              className: "member-img-element",
              // Im Dashboard gewählter Ausschnitt
              style: photoTransform(member),
            }} />
          </div>
        </div>

        {/* Overlay und Name: zu im eigenen Ausschnitt, offen im Nachbar-Ausschnitt */}
        <div className="image-overlay" style={{ clipPath: parts.overlayClip }}></div>
        {/* Vor- und Nachname untereinander, links unten in der Ecke */}
        <div
          className="member-name"
          style={{
            ...px(parts.name),
            // ca. 16 % der Box, bei langen Namen kleiner (Righteous ≈ 0,62 em je Zeichen)
            "--name-font": `${Math.min(parts.nameSize * 0.16, (parts.nameSize * 0.84) / (longestName * 0.62))}px`,
          }}
        >
          <span className="member-firstname">{member.firstname}</span>
          {member.lastname && <span className="member-lastname">{member.lastname}</span>}
        </div>
        <MemberDescription
          html={descriptionsHtml[member.id]}
          width={gridWidth}
          height={targetFrame?.height}
          bandAt={isExpanded ? descriptionBands : null}
        />
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

    </section>
  );
}

export default Members;
