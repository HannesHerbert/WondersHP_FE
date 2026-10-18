import DOMPurify from "dompurify";

// Erlaubtes HTML in Beschreibungstexten (z.B. Mitglieder): Links und einfache Formatierung, nichts Ausführbares
const ALLOWED_TAGS = ["a", "b", "strong", "i", "em", "u", "br", "p", "ul", "ol", "li", "span"];
const ALLOWED_ATTR = ["href", "target", "rel", "title"];

// Domain ohne Protokoll, z.B. "allflavours.de" oder "www.allflavours.de/booking"
const BARE_DOMAIN = /^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}(?:[/?#].*)?$/i;

let hooksInstalled = false;

function installHooks() {
  if (hooksInstalled) return;
  hooksInstalled = true;

  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName !== "A") return;

    const href = (node.getAttribute("href") || "").trim();
    // Ohne Protokoll würde der Browser "allflavours.de" als Unterseite dieser Website lesen
    if (BARE_DOMAIN.test(href)) node.setAttribute("href", `https://${href}`);

    // Externe Links in neuem Tab, ohne Zugriff auf diese Seite
    if (/^https?:\/\//i.test(node.getAttribute("href") || "")) {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
}

/** Bereinigt HTML aus dem Dashboard für die Anzeige per dangerouslySetInnerHTML. */
export function sanitizeRichText(html) {
  installHooks();
  // Häufiger Tippfehler "href_=" wie ein normales href behandeln
  const source = String(html || "").replace(/\bhref_\s*=/gi, "href=");
  return DOMPurify.sanitize(source, { ALLOWED_TAGS, ALLOWED_ATTR });
}

// Rechtstexte (Datenschutz, Impressum): zusätzlich Zwischenüberschriften und <mark> für Platzhalter
const LEGAL_TAGS = [...ALLOWED_TAGS, "h3", "h4", "mark"];

export function sanitizeLegalText(html) {
  installHooks();
  return DOMPurify.sanitize(String(html || ""), { ALLOWED_TAGS: LEGAL_TAGS, ALLOWED_ATTR });
}
