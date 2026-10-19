// Geometrie für das Mitglieder-Grid: Das ganze Grid ist eine Form um einen gemeinsamen Mittelpunkt.
// Bis 4 Mitglieder ein Quadrat (2x2-Viertel), darüber ein regelmäßiges N-Eck aus Dreiecks-Ausschnitten.
// Jedes Mitglied ist ein Sektor dieser Form zwischen zwei Winkeln. Animiert werden nur Winkel und
// Form – alles andere (clip-paths, Bild- und Namensboxen) wird pro Frame daraus berechnet und bleibt synchron.

export const GRID_GAP = 4;
const GRID_BORDER = 1;
const TAU = Math.PI * 2;
export const START = -Math.PI / 2; // erste Sektorgrenze zeigt nach oben
const SAMPLE_STEP = Math.PI / 36; // Zwischenpunkte am Rand, damit auch Mischformen rund wirken

const lerp = (a, b, t) => a + (b - a) * t;
const dir = (angle) => ({ x: Math.cos(angle), y: Math.sin(angle) });
const add = (p, v, s = 1) => ({ x: p.x + v.x * s, y: p.y + v.y * s });
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const mod = (a, m) => ((a % m) + m) % m;
const lerpPoint = (a, b, t) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });
const lerpBox = (a, b, t) => ({
  left: lerp(a.left, b.left, t),
  top: lerp(a.top, b.top, t),
  width: lerp(a.width, b.width, t),
  height: lerp(a.height, b.height, t),
});

// ─── Formen ─────────────────────────────────────────────────────────────────

/** Quadrat (bis 4 Mitglieder) oder regelmäßiges N-Eck mit Spitze oben, passend zur Breite. */
export function createShape(n, width) {
  const isSquare = n <= 4 && n !== 3;
  const sides = isSquare ? 4 : n;
  const step = TAU / sides;
  const offset = isSquare ? -Math.PI / 4 : START; // Winkel der ersten Ecke

  const unit = Array.from({ length: sides }, (_, k) => dir(offset + k * step));
  const minX = Math.min(...unit.map((p) => p.x));
  const maxX = Math.max(...unit.map((p) => p.x));
  const minY = Math.min(...unit.map((p) => p.y));
  const maxY = Math.max(...unit.map((p) => p.y));
  const radius = width / (maxX - minX);
  const apothem = radius * Math.cos(step / 2);

  return {
    center: { x: -minX * radius, y: -minY * radius },
    height: (maxY - minY) * radius,
    radius,
    squareness: isSquare ? 1 : 0,
    corners: Array.from({ length: sides }, (_, k) => offset + k * step),
    /** Abstand Mittelpunkt → Rand in Richtung `angle`, um `inset` Pixel nach innen versetzt */
    reach(angle, inset = 0) {
      const k = Math.floor(mod(angle - offset, TAU) / step);
      return (apothem - inset) / Math.cos(angle - (offset + (k + 0.5) * step));
    },
  };
}

/** Zwischenform zweier Formen (t = 0 → a, t = 1 → b) */
export function blendShapes(a, b, t) {
  if (t <= 0) return a;
  if (t >= 1) return b;
  return {
    center: lerpPoint(a.center, b.center, t),
    height: lerp(a.height, b.height, t),
    radius: lerp(a.radius, b.radius, t),
    squareness: lerp(a.squareness, b.squareness, t),
    corners: [...a.corners, ...b.corners],
    reach: (angle, inset) => lerp(a.reach(angle, inset), b.reach(angle, inset), t),
  };
}

// ─── Zielwerte je Mitglied ──────────────────────────────────────────────────

const isTopAngle = (angle) => Math.sin(angle) <= 1e-6;

/**
 * Zielwinkel aller Mitglieder: eigener Sektor (a0–a1), Öffnungsgrad (e) und der Sektor,
 * in dem Overlay und Name liegen (o0–o1 – zu: eigener, offen: Nachbar).
 */
export function targetParams(members, visible, expandedId) {
  const n = visible.length;
  const bounds = (i) => [START + (i * TAU) / n, START + ((i + 1) * TAU) / n];
  const params = {};

  members.forEach((member) => {
    const index = visible.indexOf(member);
    if (index === -1) return;

    const [a0, a1] = bounds(index);
    const expanded = member.id === expandedId && n > 1;
    let [o0, o1] = [a0, a1];

    if (expanded) {
      // Name wandert in den Nachbarsektor derselben Reihe, bevorzugt über die senkrechte Mitte hinweg
      const mid = (a0 + a1) / 2;
      const candidates = [index - 1, index + 1].map((i) => {
        const [b0, b1] = bounds(mod(i, n));
        let bMid = (b0 + b1) / 2;
        const shift = Math.round((mid - bMid) / TAU) * TAU; // kürzester Weg um die Mitte
        bMid += shift;
        return { b0: b0 + shift, b1: b1 + shift, bMid };
      });
      const sameRow = candidates.filter((c) => isTopAngle(c.bMid) === isTopAngle(mid));
      const pool = sameRow.length ? sameRow : candidates;
      const across = pool.find((c) => Math.sign(Math.cos(c.bMid)) !== Math.sign(Math.cos(mid)));
      const target = across || pool[0];
      [o0, o1] = [target.b0, target.b1];
    }

    params[member.id] = { a0, a1, e: expanded ? 1 : 0, o0, o1 };
  });

  return params;
}

export function lerpParams(from, to, t) {
  const result = {};
  for (const [id, target] of Object.entries(to)) {
    const start = from[id] || target;
    result[id] = Object.fromEntries(Object.keys(target).map((key) => [key, lerp(start[key], target[key], t)]));
  }
  return result;
}

// ─── Geometrie eines Frames ─────────────────────────────────────────────────

const toClip = (points) => `polygon(${points.map((p) => `${p.x.toFixed(2)}px ${p.y.toFixed(2)}px`).join(", ")})`;

const boundingBox = (points) => {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  return { left, top, width: Math.max(...xs) - left, height: Math.max(...ys) - top };
};

const squareAround = (p, half) => ({ left: p.x - half, top: p.y - half, width: 2 * half, height: 2 * half });

/** Inkreis eines Dreiecks → Mittelpunkt und Radius */
function incircle(a, b, c) {
  const la = dist(b, c);
  const lb = dist(a, c);
  const lc = dist(a, b);
  const perimeter = la + lb + lc || 1;
  const center = { x: (la * a.x + lb * b.x + lc * c.x) / perimeter, y: (la * a.y + lb * b.y + lc * c.y) / perimeter };
  const area = Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;
  return { center, radius: (2 * area) / perimeter };
}

/** Rechnet die aktuelle Form plus die animierten Mitglieder-Parameter in Zeichenanweisungen um. */
export function buildFrame(shape, params) {
  const pad = GRID_GAP;
  const half = GRID_GAP / 2;
  const { center } = shape;
  const outline = (angle, inset = pad) => add(center, dir(angle), shape.reach(angle, inset));

  const anglesBetween = (a0, a1) => {
    const result = [];
    for (let a = a0 + SAMPLE_STEP; a < a1 - 1e-6; a += SAMPLE_STEP) result.push(a);
    for (const corner of shape.corners) {
      for (const turn of [-1, 0, 1, 2]) {
        const angle = corner + turn * TAU;
        if (angle > a0 + 1e-6 && angle < a1 - 1e-6) result.push(angle);
      }
    }
    return result.sort((a, b) => a - b);
  };

  /** Sektor a0–a1 als Polygon; `gap` schiebt die Kanten auseinander (Fuge zwischen Mitgliedern) */
  const sector = (a0, a1, gap = half) => {
    const h = (a1 - a0) / 2;
    const mid = a0 + h;
    // Bei schmalen Sektoren Fuge mitschrumpfen lassen, sonst schießt die Spitze nach außen
    const g = h > 1e-6 && h < Math.PI / 2 + 1e-6 ? Math.min(gap, 0.5 * shape.radius * Math.sin(h)) : 0;
    const apex = g ? add(center, dir(mid), g / Math.sin(h)) : center;
    const first = add(outline(a0), { x: -Math.sin(a0), y: Math.cos(a0) }, g);
    const last = add(outline(a1), { x: Math.sin(a1), y: -Math.cos(a1) }, g);
    return [apex, first, ...anglesBetween(a0, a1).map((a) => outline(a)), last];
  };

  /** Bild- und Namensbox eines Sektors: im Quadrat wie das 2x2-Grid, im N-Eck am Inkreis des Dreiecks */
  const sectorBoxes = (a0, a1) => {
    const points = sector(a0, a1);
    const asSquare = boundingBox(points);
    const tri = [points[0], points[1], points[points.length - 1]];
    const { center: inner, radius } = incircle(...tri);
    const reach = Math.max(...tri.map((p) => Math.max(Math.abs(p.x - inner.x), Math.abs(p.y - inner.y))));
    const s = shape.squareness;
    return {
      image: lerpBox(squareAround(inner, reach), asSquare, s),
      // Fast der ganze Inkreis-Durchmesser: Namen bleiben im Dreieck lesbar groß
      name: lerpBox(squareAround(inner, radius * 0.92), asSquare, s),
    };
  };

  // Rand als Polygon, um freie Breiten für die Beschreibung zu messen
  const ring = Array.from({ length: 144 }, (_, i) => outline(START + (i * TAU) / 144));
  const spanAt = (y) => {
    const xs = [];
    ring.forEach((p, i) => {
      const q = ring[(i + 1) % ring.length];
      if ((p.y - y) * (q.y - y) <= 0 && p.y !== q.y) xs.push(p.x + ((y - p.y) / (q.y - p.y)) * (q.x - p.x));
    });
    return xs.length ? [Math.min(...xs), Math.max(...xs)] : [center.x, center.x];
  };

  /** Waagerechte Ausdehnung eines Polygons im Band y0–y1 (oder null, wenn es das Band nicht berührt) */
  const extentInBand = (poly, y0, y1) => {
    const [lo, hi] = [Math.min(y0, y1), Math.max(y0, y1)];
    const xs = poly.filter((p) => p.y >= lo && p.y <= hi).map((p) => p.x);
    poly.forEach((p, i) => {
      const q = poly[(i + 1) % poly.length];
      for (const y of [lo, hi]) {
        if ((p.y - y) * (q.y - y) < 0) xs.push(p.x + ((y - p.y) / (q.y - p.y)) * (q.x - p.x));
      }
    });
    return xs.length ? [Math.min(...xs), Math.max(...xs)] : null;
  };

  /**
   * Freie waagerechte Abschnitte im Band y0–y1: Form minus belegte Bereiche (plus Fuge und Rand `margin`).
   * Grundlage für den Beschreibungstext, der sich zeilenweise der Restfläche anpasst.
   */
  const freeIntervals = (y0, y1, obstacles, margin = 0) => {
    const [l0, r0] = spanAt(y0 + 0.5);
    const [l1, r1] = spanAt(y1 - 0.5);
    let free = [[Math.max(l0, l1) + margin, Math.min(r0, r1) - margin]].filter(([l, r]) => r > l);

    for (const poly of obstacles) {
      const ext = extentInBand(poly, y0, y1);
      if (!ext) continue;
      const [a, b] = [ext[0] - GRID_GAP - margin, ext[1] + GRID_GAP + margin];
      free = free.flatMap(([l, r]) => [[l, Math.min(r, a)], [Math.max(l, b), r]]).filter(([l, r]) => r > l);
    }
    return free;
  };

  const fullOutline = (inset) =>
    toClip([outline(START, inset), ...anglesBetween(START, START + TAU).map((a) => outline(a, inset))]);

  const tiles = {};
  for (const [id, { a0, a1, e, o0, o1 }] of Object.entries(params)) {
    const mid = (a0 + a1) / 2;
    // Geöffnet fächert der Sektor zur ganzen Form auf. Leicht über 360° hinaus, damit keine
    // Naht sichtbar bleibt (clip-path füllt Überlappungen mit nonzero mit).
    const spread = Math.PI + 0.03;
    const tileClip = toClip(sector(lerp(a0, mid - spread, e), lerp(a1, mid + spread, e), half * (1 - e)));
    const ownPoints = sector(a0, a1);
    const sidePoints = sector(o0, o1);
    const own = sectorBoxes(a0, a1);
    const side = sectorBoxes(o0, o1);

    tiles[id] = {
      clip: tileClip,
      imageClip: toClip(ownPoints),
      imageBounds: boundingBox(ownPoints),
      image: own.image,
      overlayClip: toClip(sidePoints),
      name: side.name,
      nameSize: side.name.width,
      // Bild- und Namensbereich: der Beschreibungstext fließt um beide herum
      obstacles: [ownPoints, sidePoints],
    };
  }

  return {
    height: shape.height,
    frame: fullOutline(0),
    surface: fullOutline(GRID_BORDER),
    tiles,
    freeIntervals,
  };
}

// ─── Bildausschnitt (Dashboard) ─────────────────────────────────────────────

/** Reihenfolge im Grid: Position 1, 2, 3, … im Uhrzeigersinn ab oben */
export const sortByPosition = (members) =>
  [...members].sort((a, b) => a.image_position - b.image_position || String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));

/**
 * Transform für das Foto in seiner Bildbox: Bildpunkt (fx|fy in % der Box) rückt in die Boxmitte,
 * gezoomt um z. Standard 50/50/1 ist exakt die ungeschnittene Ansicht.
 */
export function photoTransform(member) {
  const fx = member?.image_focus_x ?? 50;
  const fy = member?.image_focus_y ?? 50;
  const z = member?.image_zoom ?? 1;
  return {
    transformOrigin: "0 0",
    transform: `translate(50%, 50%) scale(${z}) translate(${-fx}%, ${-fy}%)`,
  };
}

/**
 * Erlaubter Bereich für den Fokuspunkt, damit das Foto das Dreieck immer ganz füllt.
 * Gilt für jede Grid-Breite, weil die ganze Geometrie mit der Breite skaliert.
 */
export function focusRange(tile, zoom) {
  const axis = (start, size, lo, hi) => {
    const centre = start + size / 2;
    const min = ((centre - lo) / (zoom * size)) * 100;
    const max = (1 - (hi - centre) / (zoom * size)) * 100;
    return min <= max ? [min, max] : [(min + max) / 2, (min + max) / 2];
  };
  const box = tile.image;
  const t = tile.imageBounds;
  return {
    x: axis(box.left, box.width, t.left, t.left + t.width),
    y: axis(box.top, box.height, t.top, t.top + t.height),
  };
}
