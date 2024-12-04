import { IoCloseOutline } from "react-icons/io5";
import Songlist from "./Home/SongList";
import useModalStore from "../store/useModalStore";
import "../sass/Modal.scss"



function Modal() {

  const setModalIsShown = useModalStore((state) => state.setModalIsShown);
  const modalIsShown = useModalStore((state) => state.modalIsShown);
  const modalContent = useModalStore((state) => state.modalContent);

  return (
      <div id="modal" className={`${modalIsShown === true ? 'show' : ''}`}>

        <div className="modal-container">

          <div className="modal-header">
            <h3>{modalContent.title}</h3>
            <div className="modal-toggle" onClick={setModalIsShown}>
              <IoCloseOutline />
            </div>
          </div>

          <div className="modal-content">
            <Songlist />
          </div>
          
        </div>

      </div>
  )
}

export default Modal