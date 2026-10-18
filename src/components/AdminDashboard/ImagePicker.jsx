import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import useModalStore from "../../store/useModalStore";
import ImageSelect from "../ModalContent/ImageSelect";
import { mediaUrl } from "../../config.js";

/**
 * Bildauswahl fürs Dashboard: Vorschau des gewählten Bildes, Auswahl aus der Mediathek,
 * optional "Entfernen" (z.B. zurück zum Standard-Logo). `emptyPreview` zeigt ohne Auswahl, was stattdessen gilt.
 */
function ImagePicker({ value, onChange, clearLabel, emptyLabel = "Kein Bild gewählt", emptyPreview, previewClassName = "" }) {
  const [images, setImages] = useState([]);
  const token = useAuthStore((state) => state.getToken());
  const setModalContent = useModalStore((state) => state.setModalContent);
  const setModalIsShown = useModalStore((state) => state.setModalIsShown);

  useEffect(() => {
    axios.get("/api/admin/list-images", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setImages(res.data.data || []))
      .catch(() => setImages([]));
  }, []);

  const selected = images.find((img) => img.id === value);

  function openSelect() {
    setModalContent(
      "Bild auswählen",
      <ImageSelect
        initialImageId={value}
        onConfirm={(imageId) => {
          onChange(imageId);
          setModalIsShown(false);
        }}
        onCancel={() => setModalIsShown(false)}
      />
    );
    setModalIsShown(true);
  }

  return (
    <div className="image-picker">
      <div className={`image-picker-preview ${previewClassName}`.trim()}>
        {selected ? (
          <img src={mediaUrl(`/media/images/${selected.sourceUrlSM}`)} alt={selected.title} />
        ) : (
          value ? <span>Bild nicht gefunden</span> : emptyPreview || <span>{emptyLabel}</span>
        )}
      </div>
      <div className="image-picker-actions">
        <button type="button" className="admin-btn btn-secondary" onClick={openSelect}>
          {value ? "Anderes Bild wählen" : "Bild auswählen"}
        </button>
        {clearLabel && value && (
          <button type="button" className="admin-btn btn-secondary" onClick={() => onChange(null)}>
            {clearLabel}
          </button>
        )}
        {selected && <small className="admin-hint">{selected.title}</small>}
      </div>
    </div>
  );
}

export default ImagePicker;
