import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import useNotificationStore from "../../store/useNotificationStore";
import ImagePicker from "./ImagePicker";

// Content → Herobereich: Bild, Überschrift und Text auf der Startseite
function HeroManagement() {
  const [hero, setHero] = useState(null);
  const token = useAuthStore((state) => state.getToken());
  const showNotification = useNotificationStore((state) => state.showNotification);

  useEffect(() => {
    axios.get("/api/public/hero-area")
      .then((res) => setHero(res.data.data))
      .catch(() => showNotification("Herobereich konnte nicht geladen werden", "error"));
  }, []);

  async function save() {
    try {
      const { title, text, image_id } = hero;
      const res = await axios.put("/api/admin/update-hero-area", { title, text, image_id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHero(res.data.data);
      showNotification("Herobereich gespeichert", "success");
    } catch (error) {
      showNotification("Fehler beim Speichern des Herobereichs", "error");
    }
  }

  if (!hero) return <div>Lade Daten...</div>;

  return (
    <div className="content-editor">
      <div className="admin-form-group">
        <span className="admin-label">Herobild</span>
        <ImagePicker value={hero.image_id} onChange={(image_id) => setHero({ ...hero, image_id })} />
      </div>

      <div className="admin-form-group">
        <label className="admin-label" htmlFor="hero-title">Überschrift</label>
        <input id="hero-title" type="text" className="admin-input" value={hero.title || ""} onChange={(e) => setHero({ ...hero, title: e.target.value })} />
      </div>

      <div className="admin-form-group">
        <label className="admin-label" htmlFor="hero-text">Text</label>
        <textarea id="hero-text" className="admin-textarea" style={{ minHeight: "180px" }} value={hero.text || ""} onChange={(e) => setHero({ ...hero, text: e.target.value })} />
      </div>

      <div className="admin-modal-actions" style={{ justifyContent: "flex-start" }}>
        <button className="admin-btn btn-primary" onClick={save}>Speichern</button>
      </div>
    </div>
  );
}

export default HeroManagement;
