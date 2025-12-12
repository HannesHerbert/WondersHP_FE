import { FaEdit } from "react-icons/fa";
import useModalStore from "../../store/useModalStore.js";
import ImageSelect from "../ModalContent/ImageSelect.jsx";
import CloudinaryImage from "../Snippets/CloudinaryImage.jsx";
import useAdminSettingsStore from "../../store/useAdminSettingsStore.js";

function MemberRow({ member }) {
  const setModalContent = useModalStore((state) => state.setModalContent);
  const setModalIsShown = useModalStore((state) => state.setModalIsShown);
  const setMembersArrStore = useAdminSettingsStore(
    (state) => state.setMembersArray
  );

  const membersArrStore = useAdminSettingsStore((state) => state.membersArray);

  function updateMemberImage(userId, imagePublicId) {
    const updatedMembers = membersArrStore.map((member) => {
      if (member.id === userId) {
        return { ...member, image_path: imagePublicId };
      }
      return member;
    });

    console.log(updatedMembers);

    setMembersArrStore(updatedMembers);
  }

  function toggleImageSelectModal() {
    setModalContent(
      "Bild Auswählen",
      <ImageSelect
        // callback={(publicId) => updateMemberImage(member.id, publicId)}
      />
    );
    setModalIsShown();
  }

  return (
    <div className="member-row">
      <div className="member-image">
        {/* <CloudinaryImage
          className="image-wrapper"
          publicId={member.image_path}
          size={400}
        /> */}
        <img src={member.images.sm} alt="" />
        <span title="Bild ändern" onClick={toggleImageSelectModal}>
          <FaEdit />
        </span>
      </div>

      <div className="member-informations">
        <div className="member-name">
          <label htmlFor="firstname">Vorname:</label>
          <input type="text" name="firstname" defaultValue={member.firstname} />

          <label htmlFor="lastname">Nachname:</label>
          <input type="text" name="lastname" defaultValue={member.lastname} />

          <label htmlFor="instrument">Instrument:</label>
          <input
            type="text"
            name="instrument"
            defaultValue={member.instrument}
          />

          <label htmlFor="image-position">Bildposition:</label>
          <select name="image-position" id=""></select>
        </div>

        <div className="member-description">
          <textarea defaultValue={member.description}></textarea>
        </div>
      </div>
    </div>
  );
}

export default MemberRow;
