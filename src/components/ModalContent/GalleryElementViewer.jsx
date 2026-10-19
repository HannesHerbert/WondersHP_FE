import { useState, useEffect, useRef } from "react";
import useGalleryStore from "../../store/useGalleryStore.js";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { mediaUrl } from "../../config.js";

/** Großansicht im Modal: größte Bildvariante, blättern per Pfeil, Tastatur (← →) oder Wischen */
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

    // Wischen auf dem Handy: waagerechte Bewegung ab 50px blättert
    const touchStart = useRef(null);
    const onTouchStart = (event) => {
        const t = event.touches[0];
        touchStart.current = { x: t.clientX, y: t.clientY };
    };
    const onTouchEnd = (event) => {
        if (!touchStart.current) return;
        const t = event.changedTouches[0];
        const dx = t.clientX - touchStart.current.x;
        const dy = t.clientY - touchStart.current.y;
        touchStart.current = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? showNext : showPrevious)();
    };

    const element = galleryElements[currElemIdx];
    if (!element) return null;

    const baseUrl = mediaUrl("/media/images/");
    const { images, title } = element;

    return (
        <div id="gallery-viewer" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

            <img
                src={baseUrl + images.lg}
                srcSet={`${baseUrl + images.md} 800w, ${baseUrl + images.lg} 1920w`}
                sizes="100vw"
                alt={title}
            />

            {/* Navigation unter dem Bild: zurück · Titel und Position · weiter */}
            <div className="viewer-nav">
                <button type="button" className="previous-image" onClick={showPrevious} aria-label="Vorheriges Bild"><FaArrowLeft /></button>
                <div className="image-text">
                    {title && <p>{title}</p>}
                    {count > 1 && <span className="image-count">{currElemIdx + 1} / {count}</span>}
                </div>
                <button type="button" className="next-image" onClick={showNext} aria-label="Nächstes Bild"><FaArrowRight /></button>
            </div>

        </div>
    )
}


export default GalleryElementViewer
