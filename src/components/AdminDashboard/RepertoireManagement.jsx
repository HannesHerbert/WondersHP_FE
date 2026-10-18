import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaSortAlphaDown, FaSortAlphaUpAlt } from "react-icons/fa";
import useAuthStore from "../../store/useAuthStore";
import useNotificationStore from "../../store/useNotificationStore";
import "../../sass/Repertoire.scss";

const EMPTY_SONG = { title: "", artist: "" };

// Dashboard → Repertoire: eine Liste aus Titel + Interpret, alphabetisch auf- oder absteigend
function RepertoireManagement() {
  const [songs, setSongs] = useState([]);
  const [drafts, setDrafts] = useState({}); // ungespeicherte Änderungen je Song-ID
  const [newSong, setNewSong] = useState(EMPTY_SONG);
  const [isLoading, setIsLoading] = useState(true);
  const [sortDir, setSortDir] = useState("asc"); // Anzeige nach Titel: asc = A–Z, desc = Z–A

  const token = useAuthStore((state) => state.getToken());
  const showNotification = useNotificationStore((state) => state.showNotification);
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchSongs();
  }, []);

  async function fetchSongs() {
    try {
      const res = await axios.get("/api/admin/songs", { headers });
      setSongs(res.data.data || []);
    } catch (error) {
      showNotification("Repertoire konnte nicht geladen werden", "error");
    } finally {
      setIsLoading(false);
    }
  }

  const sorted = [...songs].sort((a, b) => {
    const byTitle = a.title.localeCompare(b.title, "de", { sensitivity: "base" });
    return (sortDir === "asc" ? byTitle : -byTitle) || a.artist.localeCompare(b.artist, "de");
  });
  const valueOf = (song, field) => drafts[song.id]?.[field] ?? song[field] ?? "";
  const isDirty = (song) => Boolean(drafts[song.id]);
  const dirtyCount = songs.filter(isDirty).length;

  function editField(song, field, value) {
    setDrafts((prev) => ({ ...prev, [song.id]: { ...prev[song.id], [field]: value } }));
  }

  async function saveSong(song, changes = drafts[song.id]) {
    if (!changes) return true;
    try {
      const res = await axios.put(`/api/admin/songs/${song.id}`, changes, { headers });
      setSongs((list) => list.map((s) => (s.id === song.id ? res.data.data : s)));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[song.id];
        return next;
      });
      return true;
    } catch (error) {
      showNotification(error.response?.data?.message || "Speichern fehlgeschlagen", "error");
      return false;
    }
  }

  async function saveAll() {
    const dirty = songs.filter(isDirty);
    const results = await Promise.all(dirty.map((song) => saveSong(song)));
    if (results.every(Boolean)) showNotification(`${dirty.length} ${dirty.length === 1 ? "Song" : "Songs"} gespeichert`, "success");
  }

  async function deleteSong(song) {
    if (!window.confirm(`„${song.title}“ aus dem Repertoire löschen?`)) return;
    try {
      await axios.delete(`/api/admin/songs/${song.id}`, { headers });
      setSongs((list) => list.filter((s) => s.id !== song.id));
      showNotification("Song gelöscht", "success");
    } catch (error) {
      showNotification("Löschen fehlgeschlagen", "error");
    }
  }

  async function addSong(event) {
    event.preventDefault();
    try {
      const res = await axios.post("/api/admin/songs", newSong, { headers });
      setSongs((list) => [...list, res.data.data]);
      setNewSong(EMPTY_SONG);
      showNotification(`„${res.data.data.title}“ hinzugefügt`, "success");
    } catch (error) {
      showNotification(error.response?.data?.message || "Hinzufügen fehlgeschlagen", "error");
    }
  }

  if (isLoading) return <div>Lade Repertoire …</div>;

  return (
    <div id="repertoire-management">
      <div className="repertoire-toolbar">
        <p className="repertoire-summary">{songs.length} Songs</p>
        <button
          type="button"
          className="admin-btn btn-secondary sort-toggle"
          onClick={() => setSortDir((dir) => (dir === "asc" ? "desc" : "asc"))}
          aria-label={sortDir === "asc" ? "Sortiert A bis Z – umschalten auf Z bis A" : "Sortiert Z bis A – umschalten auf A bis Z"}
        >
          {sortDir === "asc" ? <FaSortAlphaDown aria-hidden="true" /> : <FaSortAlphaUpAlt aria-hidden="true" />}
          {sortDir === "asc" ? "A–Z" : "Z–A"}
        </button>
        <button type="button" className="admin-btn btn-primary" onClick={saveAll} disabled={dirtyCount === 0}>
          {dirtyCount ? `${dirtyCount} Änderung${dirtyCount === 1 ? "" : "en"} speichern` : "Alles gespeichert"}
        </button>
      </div>

      {sorted.length === 0 && <p className="repertoire-empty">Noch keine Songs. Füge unten den ersten hinzu.</p>}

      <ol className="repertoire-list">
        {sorted.map((song, index) => (
          <li key={song.id} className={`song-row${isDirty(song) ? " dirty" : ""}`}>
            <span className="song-no">{index + 1}</span>
            <input
              className="song-input song-title"
              aria-label="Titel"
              value={valueOf(song, "title")}
              onChange={(e) => editField(song, "title", e.target.value)}
            />
            <input
              className="song-input song-artist"
              aria-label="Interpret"
              value={valueOf(song, "artist")}
              onChange={(e) => editField(song, "artist", e.target.value)}
            />
            <div className="song-actions">
              <button type="button" className="icon-btn danger" onClick={() => deleteSong(song)} aria-label={`${song.title} löschen`}>
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ol>

      <form className="repertoire-add" onSubmit={addSong}>
        <h3>Song hinzufügen</h3>
        <div className="song-row">
          <input
            className="song-input song-title"
            placeholder="Titel"
            aria-label="Titel"
            required
            value={newSong.title}
            onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
          />
          <input
            className="song-input song-artist"
            placeholder="Interpret"
            aria-label="Interpret"
            required
            value={newSong.artist}
            onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
          />
          <button type="submit" className="admin-btn btn-secondary">Hinzufügen</button>
        </div>
      </form>
    </div>
  );
}

export default RepertoireManagement;
