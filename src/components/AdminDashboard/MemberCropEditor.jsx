import { useMemo, useRef } from "react";
import useAdminSettingsStore from "../../store/useAdminSettingsStore.js";
import Image from "../Snippets/Image.jsx";
import { createShape, targetParams, buildFrame, sortByPosition, photoTransform, focusRange } from "../Home/membersLayout";
import "../../sass/MemberCropEditor.scss";

const STAGE_W = 420;
const ZOOM_MAX = 3;
const DEFAULTS = { image_focus_x: 50, image_focus_y: 50, image_zoom: 1 };

const px = (rect) => ({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
const clamp = (v, [min, max]) => Math.min(max, Math.max(min, v));

/**
 * Bildausschnitt eines Mitglieds wählen – direkt im Dreieck, das sich aus Mitgliederzahl
 * und Position im Grid ergibt. Ziehen verschiebt das Foto, der Regler zoomt.
 * Änderungen landen sofort im Store und werden mit „Speichern“ im Dashboard übernommen.
 */
function MemberCropEditor({ memberId, onClose }) {
  const members = useAdminSettingsStore((state) => state.membersArray) || [];
  const setMembers = useAdminSettingsStore((state) => state.setMembersArray);
  const drag = useRef(null);

  const ordered = useMemo(() => sortByPosition(members), [members]);
  const member = ordered.find((m) => m.id === memberId);

  // Gleiche Geometrie wie auf der Startseite, nur in fester Breite
  const frame = useMemo(() => {
    const shape = createShape(ordered.length, STAGE_W);
    return buildFrame(shape, targetParams(ordered, ordered, null));
  }, [ordered.length, ordered.map((m) => m.id).join(",")]);

  if (!member) return null;
  const tile = frame.tiles[member.id];
  const zoom = member.image_zoom ?? 1;

  // Werte immer so begrenzen, dass das Dreieck gefüllt bleibt
  const update = (changes) => {
    const next = { ...member, ...changes };
    const range = focusRange(tile, next.image_zoom ?? 1);
    next.image_focus_x = clamp(next.image_focus_x ?? 50, range.x);
    next.image_focus_y = clamp(next.image_focus_y ?? 50, range.y);
    setMembers(members.map((m) => (m.id === member.id ? next : m)));
  };

  const onPointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, fx: member.image_focus_x ?? 50, fy: member.image_focus_y ?? 50 };
  };

  const onPointerMove = (event) => {
    if (!drag.current) return;
    const { x, y, fx, fy } = drag.current;
    // Foto folgt der Maus: Fokuspunkt wandert entgegen der Zugrichtung
    update({
      image_focus_x: fx - ((event.clientX - x) / (zoom * tile.image.width)) * 100,
      image_focus_y: fy - ((event.clientY - y) / (zoom * tile.image.height)) * 100,
    });
  };

  const endDrag = () => { drag.current = null; };

  const photo = (
    <Image imageObject={{
      images: member.images,
      altText: `${member.firstname} ${member.lastname}`.trim(),
      className: "crop-img",
      style: photoTransform(member),
    }} />
  );

  return (
    <div className="member-crop-editor">
      <div
        className="crop-stage"
        style={{ width: STAGE_W, height: frame.height }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {/* Ganze Form als Orientierung, die anderen Plätze nur angedeutet */}
        <div className="crop-shape" style={{ clipPath: frame.frame }}></div>
        {ordered.filter((m) => m.id !== member.id).map((m) => (
          <div key={m.id} className="crop-other" style={{ clipPath: frame.tiles[m.id].imageClip }}></div>
        ))}

        {/* Foto außerhalb des Dreiecks blass, im Dreieck so wie später im Grid */}
        <div className="crop-photo crop-ghost" style={px(tile.image)}>{photo}</div>
        <div className="crop-clip" style={{ clipPath: tile.imageClip }}>
          <div className="crop-photo" style={px(tile.image)}>{photo}</div>
        </div>
      </div>

      <div className="crop-controls">
        <label className="admin-label" htmlFor={`crop-zoom-${member.id}`}>
          Zoom: {zoom.toFixed(2)}×
        </label>
        <input
          id={`crop-zoom-${member.id}`}
          type="range"
          min="1"
          max={ZOOM_MAX}
          step="0.01"
          value={zoom}
          onChange={(event) => update({ image_zoom: Number(event.target.value) })}
        />
        <small className="admin-hint">
          Bild im Dreieck ziehen, um den Ausschnitt zu verschieben. Übernehmen mit „Speichern“ unter der Mitgliederliste.
        </small>
      </div>

      <div className="admin-modal-actions">
        <button type="button" className="admin-btn btn-secondary" onClick={() => update(DEFAULTS)}>Zurücksetzen</button>
        <button type="button" className="admin-btn btn-primary" onClick={onClose}>Fertig</button>
      </div>
    </div>
  );
}

export default MemberCropEditor;
