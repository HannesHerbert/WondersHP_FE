import { useState, useEffect } from "react";
import axios from "axios";
import Image from "../Snippets/Image";
import { TiTick } from "react-icons/ti";

function ImageSelect({ onConfirm, onCancel, initialImageId = null }) {
  const [imagesObjects, setImagesObjects] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(initialImageId);

  async function fetchImages() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/admin/list-images`
      );
      setImagesObjects(response.data.data);
    } catch (error) {
      console.error("Fehler beim Abrufen der Bilder:", error);
    }
  }

  function selectImage(imageId) {
    setSelectedImageId(imageId);
  }

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div id="image-select">

      {/* Bilderliste */}
      <div className="image-list">
        {imagesObjects.map((image) => (
          <div
            key={image.id}
            className={`image-wrapper ${
              image.id === selectedImageId ? "selected" : ""
            }`}
            onClick={() => selectImage(image.id)}
          >
            {image.id === selectedImageId && (
              <span className="tick-icon">
                <TiTick />
              </span>
            )}

            <Image
              imageObject={{
                images: {
                  sm: image.sourceUrlSM,
                  md: image.sourceUrlMD,
                  lg: image.sourceUrlLG,
                },
                altText: image.title,
              }}
            />
          </div>
        ))}
      </div>

      {/* Aktionen */}
      <div className="image-select-actions">
        <button type="button" onClick={onCancel}>
          Abbrechen
        </button>

        <button
          type="button"
          disabled={!selectedImageId}
          onClick={() => onConfirm(selectedImageId)}
        >
          Übernehmen
        </button>
      </div>
    </div>
  );
}

export default ImageSelect;
