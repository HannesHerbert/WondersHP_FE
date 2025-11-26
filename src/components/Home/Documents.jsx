import useModalStore from "../../store/useModalStore";
import SongList from "./SongList";




function Documents() {
    
    const setModalContent = useModalStore((state) => state.setModalContent);
    const setModalIsShown = useModalStore((state) => state.setModalIsShown);

    const handleOpenModal = () => {
        setModalContent("Unser Repertoire", <SongList />);
        setModalIsShown();
      };

      const openPDF = () => {
        window.open("/src/assets/documents/Techrider.pdf", "_blank");
      };


    return(
        <div id="documents">

            <a onClick={handleOpenModal}>
                <div>
                    <img src="/src/assets/images/next-arrow-svgrepo-com.svg" alt="" />
                </div>
                
                <p>Hier gehts zu unserem Repertoire</p>
            </a>

            <a  onClick={openPDF}
            // href='/src/assets/documents/Techrider.pdf' download='Techrider.pdf'
            >
                <div>
                    <img src="/src/assets/images/next-arrow-svgrepo-com.svg" alt="" />
                </div>
                
                <p>Hier gehts zu unserem Techrider</p>
            </a>

        </div>
    )

}

export default Documents