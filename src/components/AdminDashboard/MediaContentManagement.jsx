import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaPlus } from "react-icons/fa";
import useAuthStore from "../../store/useAuthStore";
import useNotificationStore from "../../store/useNotificationStore";
import ImagePicker from "./ImagePicker";

// Content → Medien: Plattencover, Demotitel (Audiodateien aus der Mediathek) und Video auf der Startseite
function MediaContentManagement() {
  const [content, setContent] = useState(null);
  const [audioFiles, setAudioFiles] = useState([]);
  const [videos, setVideos] = useState([]);
  const token = useAuthStore((state) => state.getToken());
  const showNotification = useNotificationStore((state) => state.showNotification);
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    Promise.all([
      axios.get("/api/public/media-content"),
      axios.get("/api/admin/list-audio", { headers }),
      axios.get("/api/admin/list-videos", { headers }),
    ])
      .then(([media, audio, video]) => {
        const data = media.data.data;
        setContent({
          coverImageId: data.coverImageId,
          videoId: data.videoId,
          tracks: data.tracks.map(({ file, title, original }) => ({ file, title, original })),
        });
        setAudioFiles(audio.data.data || []);
        setVideos(video.data.data || []);
      })
      .catch(() => showNotification("Medien konnten nicht geladen werden", "error"));
  }, []);

  const updateTrack = (index, field, value) =>
    setContent((c) => ({ ...c, tracks: c.tracks.map((t, i) => (i === index ? { ...t, [field]: value } : t)) }));

  const addTrack = () => {
    const unused = audioFiles.find((f) => !content.tracks.some((t) => t.file === f.filename));
    const file = (unused || audioFiles[0])?.filename || "";
    setContent((c) => ({ ...c, tracks: [...c.tracks, { file, title: file.replace(/\.[^.]+$/, ""), original: "" }] }));
  };

  const removeTrack = (index) => setContent((c) => ({ ...c, tracks: c.tracks.filter((_, i) => i !== index) }));

  async function save() {
    try {
      await axios.put("/api/admin/media-content", content, { headers });
      showNotification("Medien gespeichert", "success");
    } catch (error) {
      showNotification(error.response?.data?.message || "Fehler beim Speichern der Medien", "error");
    }
  }

  if (!content) return <div>Lade Daten...</div>;

  return (
    <div className="content-editor">
      <div className="admin-form-group">
        <span className="admin-label">Bild (Plattencover)</span>
        <ImagePicker
          value={content.coverImageId}
          onChange={(coverImageId) => setContent({ ...content, coverImageId })}
          clearLabel="Automatisch wählen"
          emptyLabel="Automatisch: erstes Galeriebild"
        />
      </div>

      <div className="admin-form-group">
        <span className="admin-label">Demotitel</span>
        <ol className="track-editor">
          {content.tracks.map((track, index) => (
            <li key={index} className="track-editor-row">
              <span className="track-editor-no">{index + 1}</span>
              <select
                className="admin-select"
                aria-label="Audiodatei"
                value={track.file}
                onChange={(e) => updateTrack(index, "file", e.target.value)}
              >
                {!audioFiles.some((f) => f.filename === track.file) && <option value={track.file}>{track.file} (fehlt)</option>}
                {audioFiles.map((f) => <option key={f.filename} value={f.filename}>{f.filename}</option>)}
              </select>
              <input className="admin-input" aria-label="Titel" placeholder="Titel" value={track.title} onChange={(e) => updateTrack(index, "title", e.target.value)} />
              <input className="admin-input" aria-label="Original" placeholder="Original (z.B. Bill Withers)" value={track.original} onChange={(e) => updateTrack(index, "original", e.target.value)} />
              <button type="button" className="icon-btn danger" onClick={() => removeTrack(index)} aria-label={`${track.title || "Titel"} entfernen`}>
                <FaTrash />
              </button>
            </li>
          ))}
        </ol>
        <div>
          <button type="button" className="admin-btn btn-secondary" onClick={addTrack} disabled={audioFiles.length === 0}>
            <FaPlus /> Titel hinzufügen
          </button>
        </div>
        <small className="admin-hint">Audiodateien lädst du unter „Medien“ hoch. Die Reihenfolge hier ist die Trackliste auf der Seite.</small>
      </div>

      <div className="admin-form-group">
        <label className="admin-label" htmlFor="media-video">Video</label>
        <select
          id="media-video"
          className="admin-select"
          value={content.videoId ?? ""}
          onChange={(e) => setContent({ ...content, videoId: e.target.value ? Number(e.target.value) : null })}
        >
          <option value="">Automatisch (erstes Video)</option>
          {videos.map((v) => <option key={v.id} value={v.id}>{v.title}</option>)}
        </select>
      </div>

      <div className="admin-modal-actions" style={{ justifyContent: "flex-start" }}>
        <button className="admin-btn btn-primary" onClick={save}>Speichern</button>
      </div>
    </div>
  );
}

export default MediaContentManagement;
