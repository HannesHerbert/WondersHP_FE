import { useState, useEffect } from "react";
import useModalStore from "../../store/useModalStore.js";
import useGalleryStore from "../../store/useGalleryStore.js";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";


function GalleryElementViewer({ currIdx }) {

    const galleryElements = useGalleryStore((state) => state.galleryElements);
    // const currElemIdx = useGalleryStore((state) => state.currElementIndex);
    // const setCurrElemIdx = useGalleryStore((state) => state.setCurrGalleryElementIndex());

    const [currElemIdx, setCurrElemIdx] = useState(currIdx);

    console.log('GEV: ', galleryElements, currElemIdx);

    const imageUrl = galleryElements[currElemIdx].src;
    const imageTitle = galleryElements[currElemIdx].title;

    function getNextImage() {
        console.log('give next image');
        if (currElemIdx === galleryElements.length - 1) {
            setCurrElemIdx(0);
            return;
        } else {setCurrElemIdx(currElemIdx + 1);}
    }

    function getPreviousImage() {
        console.log('give previous image');
        if (currElemIdx === 0) {
            setCurrElemIdx(galleryElements.length - 1);
            return;
        } else {setCurrElemIdx(currElemIdx - 1);}
    }

    useEffect(() => {
        console.log('Current Element Index: ', currElemIdx);
    }, [currElemIdx]);

    let element =   <div>
                        <img src={imageUrl} alt={imageTitle} />
                        <div className="image-text">
                            <p>{imageTitle}</p>
                        </div>
                    </div>;


    return (
        <div id="gallery-viewer">

            <div className="previous-image" onClick={getPreviousImage}><FaArrowLeft /></div>

            <img src={imageUrl} alt="{imageUrl}" />
            <div className="image-text">
                <p>{imageTitle}</p>
            </div>

            <div className="next-image" onClick={getNextImage}><FaArrowRight /></div>

        </div>
    )
}


export default GalleryElementViewer