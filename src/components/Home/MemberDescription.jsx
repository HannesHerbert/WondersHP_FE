import { useLayoutEffect, useRef } from "react";

// Erst Schrift verkleinern, dann (bei sehr langen Texten / kleinem Grid) den Zeilenabstand
const LINE_HEIGHTS = [1.5, 1.35, 1.22];
const MIN_FONT_FACTOR = 0.55; // kleinste Schrift relativ zur CSS-Schriftgröße
const MIN_FONT_PX = 8;
const FONT_STEP = 0.94;
const START_STEP = 2; // Raster der Startzeile beim Zentrieren (px)

const lineHeightFor = (fontSize, factor) => Math.round(fontSize * factor);
// Schmalere Zeilenreste bleiben leer – dort passt kaum ein Wort
const minLineWidth = (fontSize) => Math.max(32, fontSize * 4);

const BLOCK_TAGS = new Set(["P", "UL", "OL", "LI", "DIV"]);

const escapeHtml = (text) => text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** Öffnendes und schließendes Tag eines Elements ohne Inhalt, z.B. <a href="…"> und </a> */
function tagPair(el) {
  const html = el.cloneNode(false).outerHTML;
  const close = html.lastIndexOf("</");
  return close === -1 ? [html, ""] : [html.slice(0, close), html.slice(close)];
}

/**
 * Bereinigtes HTML → Wörter (mit ihrer Formatierung: Links, fett, kursiv), Leerräume und Umbrüche.
 * Zeilenumbrüche aus dem Textfeld zählen wie <br>.
 */
function tokenize(html) {
  const root = document.createElement("div");
  root.innerHTML = html || "";
  const tokens = [];
  const walk = (node, chain) => {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        for (const part of child.textContent.split(/(\n|[^\S\n]+)/)) {
          if (!part) continue;
          if (part === "\n") tokens.push({ br: true });
          else if (/^\s+$/.test(part)) tokens.push({ space: true });
          else tokens.push({ word: part, chain });
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.tagName === "BR") tokens.push({ br: true });
        else if (BLOCK_TAGS.has(child.tagName)) {
          // Absätze und Listen: eigener Zeilenbeginn, Listenpunkte mit •
          tokens.push({ br: true });
          if (child.tagName === "LI") tokens.push({ word: "•", chain }, { space: true });
          walk(child, chain);
          tokens.push({ br: true });
        } else walk(child, [...chain, tagPair(child)]);
      }
    }
  };
  walk(root, []);
  return tokens;
}

const wordHtml = (token) =>
  token.chain.reduceRight((inner, [open, close]) => open + inner + close, escapeHtml(token.word));

/**
 * Beschreibung eines Mitglieds, die sich der freien Restfläche des N-Ecks anpasst.
 * Jedes Wort wird einmal gemessen, der Umbruch passiert hier im Code und jede Zeile wird
 * absolut in ihren freien Abschnitt gesetzt (Floats stapelt der Browser nicht zuverlässig genug).
 * Vertikal zentriert; passt der Text nicht, wird die Schrift kleiner – nie ein Scrollbalken.
 *
 * bandAt(y0, y1) liefert die freien waagerechten Abschnitte [[links, rechts], …] im Band y0–y1.
 */
function MemberDescription({ html, width, height, bandAt }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !bandAt || !width || !height) return;

    let cancelled = false;
    const tokens = tokenize(html);
    const words = tokens.filter((t) => t.word);
    // Freie Abschnitte je Band zwischenspeichern – beim Zentrieren kommen dieselben Bänder oft vor
    const bandCache = new Map();
    const freeAt = (y0, y1) => {
      const key = `${y0}|${y1}`;
      if (!bandCache.has(key)) bandCache.set(key, bandAt(y0, y1));
      return bandCache.get(key);
    };

    // Wortbreiten bei einer Schriftgröße – eine Messung für alle Wörter; liefert die Breite eines Leerzeichens
    const measure = (fontSize) => {
      el.style.fontSize = `${fontSize}px`;
      el.innerHTML = `<div class="desc-measure">${words.map((w) => `<span>${wordHtml(w)}</span>`).join("")}<span>&nbsp;</span></div>`;
      const spans = el.querySelectorAll(".desc-measure > span");
      words.forEach((w, i) => { w.width = spans[i].getBoundingClientRect().width; });
      return spans[spans.length - 1].getBoundingClientRect().width;
    };

    // Pro Band den Abschnitt wählen: möglichst am vorigen anschließend, sonst den breitesten
    const pickBands = (top, lh, minWidth) => {
      const bands = [];
      let prev = null;
      for (let y = top; y + lh <= height + 0.01; y += lh) {
        const options = freeAt(y, y + lh).filter(([l, r]) => r - l >= minWidth);
        let pick = null;
        if (options.length) {
          const overlap = ([l, r]) => (prev ? Math.min(r, prev[1]) - Math.max(l, prev[0]) : 0);
          pick = options.reduce((best, cur) => {
            if (!best) return cur;
            const [ob, oc] = [overlap(best), overlap(cur)];
            if (ob !== oc && (ob > 0 || oc > 0)) return oc > ob ? cur : best;
            return cur[1] - cur[0] > best[1] - best[0] ? cur : best;
          }, null);
        }
        if (pick) bands.push({ y, left: pick[0], width: pick[1] - pick[0] });
        if (pick) prev = pick;
      }
      return bands;
    };

    // Erster und letzter Bereich, in dem eine Zeile überhaupt Platz hat
    const usableRange = (lh, minWidth) => {
      const fits = (y) => freeAt(y, y + lh).some(([l, r]) => r - l >= minWidth);
      let top = null;
      let bottom = null;
      for (let y = 0; y + lh <= height; y += 2) if (fits(y)) { top = y; break; }
      for (let y = Math.floor(height - lh); y >= 0; y -= 2) if (fits(y)) { bottom = y + lh; break; }
      return top === null || bottom === null || bottom <= top ? null : [top, bottom];
    };

    /**
     * Umbruch in die Bänder. complete = false, wenn Wörter übrig bleiben.
     * Ein Wort, das nicht in ein Band passt, rutscht ins nächste.
     */
    const breakLines = (bands, space) => {
      const lines = [];
      let i = 0;
      for (const band of bands) {
        if (i >= tokens.length) break;
        const items = [];
        let used = 0;
        let pendingSpace = false;
        for (; i < tokens.length; i++) {
          const t = tokens[i];
          if (t.br) {
            if (items.length || pendingSpace === "br") { i++; break; }
            pendingSpace = "br"; // Absatz am Zeilenanfang nicht als Leerzeile verschwenden
            continue;
          }
          if (t.space) { pendingSpace = items.length > 0; continue; }
          const add = (pendingSpace === true ? space : 0) + t.width;
          if (used + add > band.width) break;
          items.push({ token: t, space: pendingSpace === true });
          used += add;
          pendingSpace = false;
        }
        if (items.length) lines.push({ ...band, items });
      }
      while (i < tokens.length && !tokens[i].word) i++;
      return { lines, complete: i >= tokens.length };
    };

    const render = (lines, fontSize, lh) => {
      el.style.fontSize = `${fontSize}px`;
      el.style.lineHeight = `${lh}px`;
      el.innerHTML = lines.map(({ y, left, width: w, items }) =>
        `<div class="desc-line" style="top:${y}px;left:${left}px;width:${w}px;height:${lh}px">${
          items.map(({ token, space }) => (space ? " " : "") + wordHtml(token)).join("")
        }</div>`
      ).join("");
    };

    const layout = () => {
      if (cancelled) return;
      el.innerHTML = "";
      el.style.fontSize = "";
      const baseFont = parseFloat(getComputedStyle(el).fontSize) || 16;
      const minFont = Math.max(MIN_FONT_PX, baseFont * MIN_FONT_FACTOR);

      const attempts = LINE_HEIGHTS.flatMap((factor) => {
        const sizes = [];
        for (let fontSize = baseFont; fontSize >= minFont - 0.01; fontSize *= FONT_STEP) sizes.push([fontSize, factor]);
        return factor === LINE_HEIGHTS[0] ? sizes : sizes.slice(-3); // engere Zeilen nur bei kleinster Schrift
      });

      let measuredFont = null;
      let space = 0;
      let fallback = null;

      for (const [fontSize, factor] of attempts) {
        if (measuredFont !== fontSize) { space = measure(fontSize); measuredFont = fontSize; }
        const lh = lineHeightFor(fontSize, factor);
        const minWidth = minLineWidth(fontSize);
        const range = usableRange(lh, minWidth);
        if (!range) continue;
        const [top, bottom] = range;

        // Vertikal zentrieren: Der Umbruch hängt von der Startzeile ab, darum alle Startzeilen
        // im Raster durchrechnen und die mit gleich viel Luft oben und unten nehmen
        let best = null;
        for (let start = Math.round(top); start + lh <= bottom + 0.01; start += START_STEP) {
          const bands = pickBands(start, lh, minWidth).filter((band) => band.y + lh <= bottom + 0.5);
          const { lines, complete } = breakLines(bands, space);
          if (!complete || !lines.length) continue;
          const end = lines[lines.length - 1].y + lh;
          const gap = Math.abs((lines[0].y - top) - (bottom - end));
          if (!best || gap < best.gap) best = { lines, gap };
        }
        if (best) { render(best.lines, fontSize, lh); return; }
        fallback = { fontSize, lh, top, minWidth };
      }

      // Notfall: kleinste Schrift ab oben, was nicht mehr passt, entfällt (kein Scrollbalken)
      if (!fallback) return;
      const { fontSize, lh, top, minWidth } = fallback;
      space = measure(fontSize);
      render(breakLines(pickBands(Math.round(top), lh, minWidth), space).lines, fontSize, lh);
    };

    layout();
    // Webfont kann die Wortbreiten noch ändern
    document.fonts?.ready.then(layout);
    return () => { cancelled = true; };
  }, [html, width, height, bandAt]);

  return <div className="member-description" ref={ref} style={{ left: 0, top: 0, width, height }}></div>;
}

export default MemberDescription;
