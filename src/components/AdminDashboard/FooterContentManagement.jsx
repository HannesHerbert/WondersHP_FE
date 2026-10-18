import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import useNotificationStore from "../../store/useNotificationStore";

// Content → Footer: E-Mail und Telefon im Footer, Texte für Datenschutz und Impressum
function FooterContentManagement() {
  const [data, setData] = useState(null);
  const token = useAuthStore((state) => state.getToken());
  const showNotification = useNotificationStore((state) => state.showNotification);
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get("/api/admin/footer", { headers })
      .then((res) => setData(res.data.data))
      .catch(() => showNotification("Footer konnte nicht geladen werden", "error"));
  }, []);

  const update = (field) => (e) => setData((prev) => ({ ...prev, [field]: e.target.value }));

  async function save() {
    try {
      const res = await axios.put("/api/admin/footer", data, { headers });
      setData(res.data.data);
      window.dispatchEvent(new Event("footer-content-updated"));
      showNotification("Footer gespeichert", "success");
    } catch (error) {
      showNotification(error.response?.data?.message || "Fehler beim Speichern des Footers", "error");
    }
  }

  if (!data) return <div>Lade Daten...</div>;

  return (
    <div className="content-editor footer-editor">
      <div className="footer-editor-contact">
        <div className="admin-form-group">
          <label className="admin-label" htmlFor="footer-email">E-Mail im Footer</label>
          <input id="footer-email" type="email" className="admin-input" value={data.email} onChange={update("email")} placeholder="leer = nicht anzeigen" />
        </div>
        <div className="admin-form-group">
          <label className="admin-label" htmlFor="footer-phone">Telefon im Footer</label>
          <input id="footer-phone" type="tel" className="admin-input" value={data.phone} onChange={update("phone")} placeholder="leer = nicht anzeigen" />
        </div>
      </div>

      {[
        { field: "datenschutz", label: "Datenschutz", path: "/datenschutz" },
        { field: "impressum", label: "Impressum", path: "/impressum" },
      ].map(({ field, label, path }) => (
        <div className="admin-form-group" key={field}>
          <div className="footer-editor-head">
            <label className="admin-label" htmlFor={`legal-${field}`}>Text {label}</label>
            <a href={path} target="_blank" rel="noopener noreferrer" className="footer-editor-preview">Seite ansehen ↗</a>
          </div>
          <textarea id={`legal-${field}`} className="admin-textarea legal-textarea" value={data[field]} onChange={update(field)} spellCheck />
        </div>
      ))}

      <small className="admin-hint">
        Formatierung mit einfachem HTML: {"<h3>Überschrift</h3>"}, {"<p>Absatz</p>"}, {"<br>"} Zeilenumbruch, {"<a href=\"…\">Link</a>"}, {"<b>fett</b>"}, {"<ul><li>Liste</li></ul>"}. {"<mark>…</mark>"} hebt Platzhalter gelb hervor – vor dem Livegang ersetzen.
      </small>

      <div className="admin-modal-actions" style={{ justifyContent: "flex-start" }}>
        <button className="admin-btn btn-primary" onClick={save}>Speichern</button>
      </div>
    </div>
  );
}

export default FooterContentManagement;
