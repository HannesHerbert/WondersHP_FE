import useModalStore from "../../store/useModalStore.js";
import GalleryElementViewer from "../ModalContent/GalleryElementViewer.jsx";
import { mediaUrl } from "../../config.js";

/** Kachel in der Galerie: mittlere Bildgröße, Klick öffnet die Großansicht */
function GalleryImage({ imageIndex, image }) {

  const setModalContent = useModalStore((state) => state.setModalContent);
  const setModalIsShown = useModalStore((state) => state.setModalIsShown);
  const baseUrl = mediaUrl("/media/images/");
  const { images, title } = image;

  function toggleImageViewModal() {
    setModalContent("", <GalleryElementViewer currIdx={imageIndex} />);
    setModalIsShown();
  }

  return (
    <button type="button" className="gallery-image-wrapper" onClick={toggleImageViewModal} aria-label={`${title} vergrößern`}>
      {/* Originalformat: Höhe ergibt sich aus dem Bild, die Spalten ordnen sich versetzt an */}
      <img
        src={baseUrl + images.md}
        srcSet={`${baseUrl + images.sm} 300w, ${baseUrl + images.md} 800w`}
        sizes="(max-width: 480px) 50vw, (max-width: 900px) 33vw, 360px"
        alt={title}
        loading="lazy"
      />
      {title && <span className="image-text">{title}</span>}
    </button>
  );
}

export default GalleryImage
