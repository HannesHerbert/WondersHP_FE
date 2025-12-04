import useModalStore from "../../store/useModalStore.js";
import GalleryElementViewer from "../ModalContent/GalleryElementViewer.jsx";
import useGalleryStore from "../../store/useGalleryStore.js";



function GalleryImage({ imageIndex, imageUrl, imageTitle }) {

    const setModalContent = useModalStore((state) => state.setModalContent);
    const setModalIsShown = useModalStore((state) => state.setModalIsShown);
    const setCurrElemIdx = useGalleryStore((state) => state.setCurrGalleryElementIndex);



  function toggleImageViewModal() {
    setModalContent(
      "",
      <GalleryElementViewer currIdx={imageIndex}/>
    );
    setModalIsShown();
  }


    return (
        <div className="gallery-image-wrapper"  onClick={toggleImageViewModal}>
            <img src={imageUrl} alt="{imageUrl}" />
            <div className="image-text">
                <p>{imageTitle}</p>
            </div>
        </div>
    )
}

export default GalleryImage