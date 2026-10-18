import { useEffect, useState } from "react";
import axios from "axios";
import FlourishText from "../components/Snippets/FlourishText";
import "../sass/Repertoire-page.scss";

// Bandfarben (variables.scss) – je acht Titel ein Farbband wie an der Musikbox
const COLORS = ["red_2", "red_1", "yellow_2", "yellow_1", "blue_4", "blue_3", "blue_2", "blue_1"];

const byTitle = (a, b) => a.title.localeCompare(b.title, "de", { sensitivity: "base" });

// Wahlcodes wie an der Musikbox: A1–A8, B1–B8 …
const selectionCode = (i) => `${String.fromCharCode(65 + Math.floor(i / 8))}${(i % 8) + 1}`;

// Öffentliche Seite: unser Repertoire als Jukebox-Titelstreifen
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
        <div className="rep-jukebox">
          <ul className="rep-jukebox-grid">
            {songs.map((song, i) => (
              <li key={song.id} className={`rep-strip band-${COLORS[Math.floor(i / 8) % COLORS.length]}`}>
                <span className="rep-code" aria-hidden="true">{selectionCode(i)}</span>
                <span className="rep-strip-text">
                  <span className="rep-title">{song.title}</span>
                  <span className="rep-artist">{song.artist}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default Repertoire;
