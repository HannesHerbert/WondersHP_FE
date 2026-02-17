import { FaEdit } from "react-icons/fa";
import useModalStore from "../../store/useModalStore.js";
import ImageSelect from "../ModalContent/ImageSelect.jsx";
import useAdminSettingsStore from "../../store/useAdminSettingsStore.js";
import Image from "../Snippets/Image.jsx";
import { useRef } from "react";

function MemberRow({ member }) {

  const setModalContent = useModalStore((state) => state.setModalContent);
  const setModalIsShown = useModalStore((state) => state.setModalIsShown);
  const setMembersArrStore = useAdminSettingsStore((state) => state.setMembersArray);
  const membersArrStore = useAdminSettingsStore((state) => state.membersArray);
  const imagePositionVals = useAdminSettingsStore((state) => state.imagePositionVals);

  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const instrumentRef = useRef();
  const imagePositionRef = useRef();
  const descriptionRef = useRef();

  const POSITION_OPTS = imagePositionVals.map((option, index) => {
    return (
      <option key={option.class} value={option.value}>{option.label}</option>
    )
  });


  function updateMemberImage(memberId, imageId) {
    const updatedMembers = membersArrStore.map((mem) =>
      mem.id === memberId ? { ...mem, image_id: imageId
       } : mem
    );

    console.log("Updated Members Array:", updatedMembers);
    

    setMembersArrStore(updatedMembers);
  }


  function toggleImageSelectModal() {
    setModalContent(
      "Bild auswählen",
      <ImageSelect
        initialImageId={member.image_id}
        onConfirm={(imageId) => {
          updateMemberImage(member.id, imageId);
          setModalIsShown(false);
        }}
        onCancel={() => setModalIsShown(false)}
      />
    );
    setModalIsShown(true);
  }


  function updateMembersStore() {

    const newImagePosition = parseInt(imagePositionRef.current.value);
    const oldImagePosition = member.image_position;

    // Falls sich die Position nicht geändert hat, normale Update-Logik
    if (newImagePosition === oldImagePosition) {
      const updatedMember = {
        ...member,
        firstname: firstnameRef.current.value,
        lastname: lastnameRef.current.value,
        instrument: instrumentRef.current.value,
        image_position: newImagePosition,
        description: descriptionRef.current.value
      };

      const updatedMembersArr = membersArrStore.map((mem) =>
        mem.id === member.id ? updatedMember : mem
      );

      setMembersArrStore(updatedMembersArr);
      return;
    }

    // Position hat sich geändert → Swap-Logik
    const updatedMembersArr = membersArrStore.map((mem) => {
      if (mem.id === member.id) {
        // Aktuelles Member bekommt neue Position
        return {
          ...mem,
          firstname: firstnameRef.current.value,
          lastname: lastnameRef.current.value,
          instrument: instrumentRef.current.value,
          image_position: newImagePosition,
          description: descriptionRef.current.value
        };
      } else if (mem.image_position === newImagePosition) {
        // Member mit Ziel-Position bekommt alte Position
        return {
          ...mem,
          image_position: oldImagePosition
        };
      }
      return mem;
    });

    setMembersArrStore(updatedMembersArr);
  }


  return (
    <div className="member-row">
      <div className="member-image">

        <Image imageObject={{
          images: member.images,
          altText: `${member.firstname} ${member.lastname}`,
          className: "member-image"
        }} />

        <img src={member.images.sm} alt="" />
        <span title="Bild ändern" onClick={toggleImageSelectModal}>
          <FaEdit />
        </span>
      </div>

      <div className="member-informations">

        <div className="member-name">

          <label htmlFor="firstname-input">Vorname:</label>
          <input type="text"
            id="firstname-input"
            name="firstname"
            value={member.firstname}
            ref={firstnameRef}
            onChange={updateMembersStore}
          />

          <label htmlFor="lastname-input">Nachname:</label>
          <input type="text"
            id="lastname-input"
            name="lastname"
            value={member.lastname}
            ref={lastnameRef}
            onChange={updateMembersStore}
          />

          <label htmlFor="instrument-input">Instrument:</label>
          <input type="text"
            id="instrument-input"
            name="instrument"
            value={member.instrument}
            ref={instrumentRef}
            onChange={updateMembersStore}
          />

          <label htmlFor="image-position-input">Bildposition:</label>
          <select id="image-position-input"
            name="image-position"
            ref={imagePositionRef}
            onChange={updateMembersStore}
            value={member.image_position}>

            {POSITION_OPTS}

          </select>

        </div>

        <div className="member-description">
          <textarea value={member.description}
            ref={descriptionRef}
            onChange={updateMembersStore}>
          </textarea>
        </div>

      </div>
    </div>
  );
}

export default MemberRow;
