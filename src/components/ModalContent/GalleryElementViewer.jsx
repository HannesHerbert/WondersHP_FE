import { useState, useEffect } from "react";
import useGalleryStore from "../../store/useGalleryStore.js";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { mediaUrl } from "../../config.js";

/** Großansicht im Modal: größte Bildvariante, blättern per Pfeil (auch Tastatur ← →) */
function GalleryElementViewer({ currIdx }) {

    const galleryElements = useGalleryStore((state) => state.galleryElements);
    const [currElemIdx, setCurrElemIdx] = useState(currIdx);
    const count = galleryElements?.length || 0;

    const showNext = () => setCurrElemIdx((idx) => (idx + 1) % count);
    const showPrevious = () => setCurrElemIdx((idx) => (idx - 1 + count) % count);

    useEffect(() => {
        const onKey = (event) => {
            if (event.key === "ArrowRight") showNext();
            if (event.key === "ArrowLeft") showPrevious();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [count]);

    const element = galleryElements[currElemIdx];
    if (!element) return null;

    const baseUrl = mediaUrl("/media/images/");
    const { images, title } = element;

    return (
        <div id="gallery-viewer">

            <button type="button" className="previous-image" onClick={showPrevious} aria-label="Vorheriges Bild"><FaArrowLeft /></button>

            <img
                src={baseUrl + images.lg}
                srcSet={`${baseUrl + images.md} 800w, ${baseUrl + images.lg} 1920w`}
                sizes="90vw"
                alt={title}
            />
            <div className="image-text">
                <p>{title}</p>
            </div>

            <button type="button" className="next-image" onClick={showNext} aria-label="Nächstes Bild"><FaArrowRight /></button>

        </div>
    )
}


export default GalleryElementViewer
