import { useEffect, useState } from "react";
import axios from "axios";
import FlourishText from "../components/Snippets/FlourishText";
import "../sass/Repertoire-page.scss";

/** Stabiler Pseudo-Zufall je Titel, damit Größe und Farbe bei jedem Laden gleich bleiben */
function hash(text) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

const SIZES = ["s", "m", "l", "xl"];

const byTitle = (a, b) => a.title.localeCompare(b.title, "de", { sensitivity: "base" });

// Öffentliche Seite: unser Repertoire als Konzertplakat – Titel in wechselnden Größen und Farben,
// getrennt durch Sterne, Interpret klein dahinter
function Repertoire() {
  const [songs, setSongs] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    axios.get("/api/public/repertoire")
      .then((res) => {
        setSongs((res.data.data || []).sort(byTitle));
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <section id="repertoire">
      <header className="rep-head">
        <h2><FlourishText>Repertoire</FlourishText></h2>
        <p className="rep-intro">Soul, Funk und Disco von Bill Withers bis Stevie Wonder.</p>
      </header>

      {status === "error" && <p className="rep-message">Das Repertoire konnte gerade nicht geladen werden.</p>}
      {status === "ready" && songs.length === 0 && <p className="rep-message">Hier erscheinen bald unsere Songs.</p>}

      {songs.length > 0 && (
        <ul className="rep-poster">
          {songs.map((song) => {
            const h = hash(song.title);
            // Kurze Titel dürfen größer werden, lange bleiben lesbar klein
            const base = song.title.length > 22 ? 0 : song.title.length > 14 ? 1 : 2;
            const size = SIZES[Math.min(3, base + (h % 2))];
            return (
              <li key={song.id} className={`rep-poster-item size-${size} tone-${h % 4}`}>
                <span className="rep-title">{song.title}</span>
                <span className="rep-artist">{song.artist}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default Repertoire;
