import { useState, useEffect } from "react";
import axios from "axios"; import useModalStore from "../../store/useModalStore.js";
import MediaUpload from "../ModalContent/MediaUpload.jsx";



function MediaManagement() {

  const [isInit, setIsInit] = useState([true]);
  const setModalContent = useModalStore((state) => state.setModalContent);
  const setModalIsShown = useModalStore((state) => state.setModalIsShown);

  function openUploadModal() {
    setModalContent(
      "Bild/Video hochladen",
      <MediaUpload />
    );
    setModalIsShown();
  }


  return (
    <div id="media-management">

      <section className="media-upload">
        <button onClick={openUploadModal}>Hochladen</button>
      </section>

    </div>
  )
}

export default MediaManagement