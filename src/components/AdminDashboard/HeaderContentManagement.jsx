import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import useNotificationStore from "../../store/useNotificationStore";
import ImagePicker from "./ImagePicker";
import SocialLinksManagement from "./SocialLinksManagement";
import Logo from "../Layout/Logo";

// Content → Header: Logo (eigenes Bild oder animiertes Standard-Logo) und Social-Media-Links
function HeaderContentManagement() {
  const [logoImageId, setLogoImageId] = useState(undefined);
  const token = useAuthStore((state) => state.getToken());
  const showNotification = useNotificationStore((state) => state.showNotification);

  useEffect(() => {
    axios.get("/api/public/header")
      .then((res) => setLogoImageId(res.data.data?.logoImageId ?? null))
      .catch(() => showNotification("Header konnte nicht geladen werden", "error"));
  }, []);

  async function saveLogo() {
    try {
      const res = await axios.put("/api/admin/header", { logoImageId }, { headers: { Authorization: `Bearer ${token}` } });
      setLogoImageId(res.data.data?.logoImageId ?? null);
      window.dispatchEvent(new Event("header-content-updated"));
      showNotification("Logo gespeichert", "success");
    } catch (error) {
      showNotification(error.response?.data?.message || "Fehler beim Speichern des Logos", "error");
    }
  }

  if (logoImageId === undefined) return <div>Lade Daten...</div>;

  return (
    <div className="content-editor">
      <div className="admin-form-group">
        <span className="admin-label">Logo</span>
        <ImagePicker
          value={logoImageId}
          onChange={setLogoImageId}
          clearLabel="Standard-Logo verwenden"
          previewClassName="logo-preview"
          emptyPreview={<Logo />}
        />
        <small className="admin-hint">{logoImageId ? "Eigenes Logo gewählt." : "Aktiv: Standard-Logo (animiert)."}</small>
        <small className="admin-hint">Ohne eigenes Bild zeigt der Header das animierte Regenbogen-Logo. Am besten ein Bild mit transparentem Hintergrund (PNG/WebP).</small>
      </div>
      <div className="admin-modal-actions" style={{ justifyContent: "flex-start" }}>
        <button className="admin-btn btn-primary" onClick={saveLogo}>Logo speichern</button>
      </div>

      <SocialLinksManagement />
    </div>
  );
}

export default HeaderContentManagement;
