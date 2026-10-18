import { useEffect, useState } from "react";
import axios from "axios";
import { FaYoutube, FaInstagram, FaFacebookF } from "react-icons/fa";
import useAuthStore from "../../store/useAuthStore";
import useNotificationStore from "../../store/useNotificationStore";

const FIELDS = [
  { key: "youtube", label: "YouTube", Icon: FaYoutube, placeholder: "https://www.youtube.com/@…" },
  { key: "instagram", label: "Instagram", Icon: FaInstagram, placeholder: "https://www.instagram.com/…" },
  { key: "facebook", label: "Facebook", Icon: FaFacebookF, placeholder: "https://www.facebook.com/…" },
];

// Links der Social-Media-Icons im Header; leeres Feld = Icon ausgeblendet
function SocialLinksManagement() {
  const [links, setLinks] = useState(null);
  const token = useAuthStore((state) => state.getToken());
  const showNotification = useNotificationStore((state) => state.showNotification);

  useEffect(() => {
    axios.get("/api/public/social-links")
      .then((res) => setLinks(res.data.data))
      .catch(() => showNotification("Social-Media-Links konnten nicht geladen werden", "error"));
  }, []);

  async function save() {
    try {
      const res = await axios.put("/api/admin/social-links", links, { headers: { Authorization: `Bearer ${token}` } });
      setLinks(res.data.data);
      window.dispatchEvent(new Event("social-links-updated"));
      showNotification("Social-Media-Links gespeichert", "success");
    } catch (error) {
      showNotification(error.response?.data?.message || "Fehler beim Speichern der Links", "error");
    }
  }

  if (!links) return <div>Lade Daten...</div>;

  return (
    <div className="social-links-management">
      <h3 className="admin-section-title">Social Media (Icons im Header)</h3>

      {FIELDS.map(({ key, label, Icon, placeholder }) => (
        <div className="admin-form-group" key={key}>
          <label className="admin-label" htmlFor={`social-${key}`}>
            <Icon aria-hidden="true" /> {label}
          </label>
          <input
            id={`social-${key}`}
            type="url"
            className="admin-input"
            placeholder={placeholder}
            value={links[key] || ""}
            onChange={(e) => setLinks((prev) => ({ ...prev, [key]: e.target.value }))}
          />
        </div>
      ))}
      <small className="admin-hint">Feld leer lassen, um das Icon auszublenden.</small>

      <div className="admin-modal-actions" style={{ justifyContent: "flex-start" }}>
        <button className="admin-btn btn-primary" onClick={save}>Speichern</button>
      </div>
    </div>
  );
}

export default SocialLinksManagement;
