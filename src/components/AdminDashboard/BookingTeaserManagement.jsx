import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import useNotificationStore from "../../store/useNotificationStore";
import useModalStore from "../../store/useModalStore";
import ImageSelect from "../ModalContent/ImageSelect";
import { mediaUrl } from "../../config.js";

// Teaser unter den Spielterminen: Überschrift, Bild (16:9) und Punkt, in den beim Scrollen gezoomt wird
function BookingTeaserManagement() {
  const [teaser, setTeaser] = useState(null);
  const [previewImages, setPreviewImages] = useState(null);

  const token = useAuthStore((state) => state.getToken());
  const showNotification = useNotificationStore((state) => state.showNotification);
  const setModalContent = useModalStore((state) => state.setModalContent);
  const setModalIsShown = useModalStore((state) => state.setModalIsShown);

  useEffect(() => {
    fetchTeaser();
  }, []);

  async function fetchTeaser() {
    try {
      const res = await axios.get("/api/public/booking-teaser");
      setTeaser(res.data.data);
      setPreviewImages(res.data.data.images);
    } catch (error) {
      console.error("Fehler beim Laden des Buchungs-Teasers", error);
      showNotification("Fehler beim Laden des Buchungs-Teasers", "error");
    }
  }

  async function saveTeaser() {
    try {
      const { title, image_id, focusX, focusY } = teaser;
      const res = await axios.put("/api/admin/update-booking-teaser", { title, image_id, focusX, focusY }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeaser(res.data.data);
      setPreviewImages(res.data.data.images);
      showNotification("Buchungs-Teaser gespeichert", "success");
    } catch (error) {
      console.error("Fehler beim Speichern", error);
      showNotification("Fehler beim Speichern des Buchungs-Teasers", "error");
    }
  }

  async function selectImage(imageId) {
    setTeaser((prev) => ({ ...prev, image_id: imageId }));
    // Vorschau für das neu gewählte Bild nachladen
    try {
      const res = await axios.get("/api/admin/list-images", { headers: { Authorization: `Bearer ${token}` } });
      const image = (res.data.data || []).find((img) => img.id === imageId);
      if (image) setPreviewImages({ sm: image.sourceUrlSM, md: image.sourceUrlMD, lg: image.sourceUrlLG });
    } catch (error) {
      console.error("Vorschau konnte nicht geladen werden", error);
    }
  }

  function toggleImageSelectModal() {
    setModalContent(
      "Bild auswählen",
      <ImageSelect
        initialImageId={teaser.image_id}
        onConfirm={(imageId) => {
          selectImage(imageId);
          setModalIsShown(false);
        }}
        onCancel={() => setModalIsShown(false)}
      />
    );
    setModalIsShown(true);
  }

  // Klick ins Vorschaubild setzt den Zoompunkt (in Prozent)
  function setFocus(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const focusX = +(((event.clientX - rect.left) / rect.width) * 100).toFixed(1);
    const focusY = +(((event.clientY - rect.top) / rect.height) * 100).toFixed(1);
    setTeaser((prev) => ({ ...prev, focusX, focusY }));
  }

  if (!teaser) return <div>Lade Daten...</div>;

  return (
    <div className="booking-teaser-management">
      <h3 className="admin-section-title">Buchungs-Teaser (unter den Spielterminen)</h3>

      <div className="admin-form-group">
        <label className="admin-label" htmlFor="booking-title">Überschrift</label>
        <input
          id="booking-title"
          type="text"
          className="admin-input"
          value={teaser.title || ""}
          onChange={(e) => setTeaser((prev) => ({ ...prev, title: e.target.value }))}
        />
      </div>

      <div className="admin-form-group">
        <label className="admin-label">Bild (16:9) und Zoompunkt</label>
        <button className="admin-btn btn-secondary" onClick={toggleImageSelectModal}>
          Bild auswählen
        </button>

        {previewImages?.md && (
          <>
            <div className="booking-focus-preview" onClick={setFocus} title="Klicken, um den Zoompunkt zu setzen">
              <img src={mediaUrl(`/media/images/${previewImages.md}`)} alt="Vorschau Buchungs-Teaser" />
              <span className="booking-focus-marker" style={{ left: `${teaser.focusX}%`, top: `${teaser.focusY}%` }}></span>
            </div>
            <small className="admin-hint">
              Ins Bild klicken, um den Punkt zu setzen, in den beim Scrollen gezoomt wird
              ({teaser.focusX}% / {teaser.focusY}%).
            </small>
          </>
        )}
      </div>

      <div className="admin-modal-actions" style={{ justifyContent: "flex-start" }}>
        <button className="admin-btn btn-primary" onClick={saveTeaser}>
          Speichern
        </button>
      </div>
    </div>
  );
}

export default BookingTeaserManagement;
