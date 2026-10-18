import { useState } from "react";
import HeaderContentManagement from "./HeaderContentManagement";
import HeroManagement from "./HeroManagement";
import MembersManagement from "./MembersManagement";
import MediaContentManagement from "./MediaContentManagement";
import EventManagement from "./EventManagement";
import BookingTeaserManagement from "./BookingTeaserManagement";
import FooterContentManagement from "./FooterContentManagement";

// Reihenfolge wie auf der Seite von oben nach unten
const SECTIONS = [
  { key: "header", label: "Header", hint: "Logo und Social-Media-Links", Component: HeaderContentManagement },
  { key: "hero", label: "Herobereich", hint: "Herobild, Überschrift und Text", Component: HeroManagement },
  { key: "members", label: "Mitglieder", hint: "Bandmitglieder und Special Guests", Component: MembersManagement },
  { key: "media", label: "Medien", hint: "Plattencover, Demotitel und Video", Component: MediaContentManagement },
  { key: "events", label: "Spieltermine", hint: "Termine anlegen und bearbeiten", Component: EventManagement },
  { key: "booking", label: "Buchungsteaser", hint: "Überschrift, Bild und Zoompunkt", Component: BookingTeaserManagement },
  { key: "footer", label: "Footer", hint: "E-Mail, Telefon, Datenschutz und Impressum", Component: FooterContentManagement },
];

// Dashboard → Content: ein Bereich der Seite auswählen und bearbeiten
function ContentManagement() {
  const [sectionKey, setSectionKey] = useState(SECTIONS[0].key);
  const section = SECTIONS.find((s) => s.key === sectionKey);
  const { Component } = section;

  return (
    <div id="content-management">
      <div className="content-picker">
        <label className="admin-label" htmlFor="content-section">Bereich der Seite</label>
        <select id="content-section" className="admin-select" value={sectionKey} onChange={(e) => setSectionKey(e.target.value)}>
          {SECTIONS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <small className="admin-hint">{section.hint}</small>
      </div>

      <section className="content-section" aria-label={section.label}>
        <Component key={section.key} />
      </section>
    </div>
  );
}

export default ContentManagement;
