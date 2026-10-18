import "../sass/Gallery.scss"
import { useEffect, useState } from "react";
import axios from "axios";
import GalleryImage from "../components/Snippets/GalleryImage";
import VideoPlayer from "../components/Home/VideoPlayer";
import useGalleryStore from "../store/useGalleryStore.js";

// Bilder kommen aus dem Backend: alle Bilder, die im Dashboard für die Galerie freigegeben sind
function Gallery() {

  const setGalleryElements = useGalleryStore((state) => state.setGalleryElements);
  const galleryElements = useGalleryStore((state) => state.galleryElements);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    axios.get("/api/public/gallery")
      .then((res) => {
        setGalleryElements(res.data.data || []);
        setStatus("ready");
      })
      .catch((error) => {
        console.error("Fehler beim Laden der Galerie:", error);
        setStatus("error");
      });
  }, []);

  const galleryImages = (galleryElements || []).map((image, index) => (
    <GalleryImage key={image.id} imageIndex={index} image={image} />
  ));

  return (
    <section id="gallery">

      <div id="top-video-wrapper">
        <VideoPlayer />
      </div>

      <hr className="gallery-separator" />

      {status === "error" && <p className="gallery-message">Die Galerie konnte gerade nicht geladen werden.</p>}
      {status === "ready" && galleryImages.length === 0 && <p className="gallery-message">Noch keine Bilder in der Galerie.</p>}

      <div className="gallery-wrapper">
        {galleryImages}
      </div>
    </section>
  );
}

export default Gallery;
