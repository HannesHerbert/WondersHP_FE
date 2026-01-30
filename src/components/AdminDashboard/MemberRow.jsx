import { FaEdit } from "react-icons/fa";
import useModalStore from "../../store/useModalStore.js";
import ImageSelect from "../ModalContent/ImageSelect.jsx";
import useAdminSettingsStore from "../../store/useAdminSettingsStore.js";
import Image from "../Snippets/Image.jsx";
import { useRef } from "react";

function MemberRow({ member }) {

  console.log(member);


  const setModalContent = useModalStore((state) => state.setModalContent);
  const setModalIsShown = useModalStore((state) => state.setModalIsShown);
  const setMembersArrStore = useAdminSettingsStore((state) => state.setMembersArray);
  const membersArrStore = useAdminSettingsStore((state) => state.membersArray);

  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const instrumentRef = useRef();
  const imagePositionRef = useRef();
  const descriptionRef = useRef();


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

  function updateMembersStore() {
    console.log("... MEMBERS UPDATING");

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
            defaultValue={member.firstname}
            ref={firstnameRef}
            onChange={updateMembersStore}
          />

          <label htmlFor="lastname-input">Nachname:</label>
          <input type="text"
            id="lastname-input"
            name="lastname"
            defaultValue={member.lastname}
            ref={lastnameRef}
            onChange={updateMembersStore}
          />

          <label htmlFor="instrument-input">Instrument:</label>
          <input type="text"
            id="instrument-input"
            name="instrument"
            defaultValue={member.instrument}
            ref={instrumentRef}
            onChange={updateMembersStore}
          />

          <label htmlFor="image-position-input">Bildposition:</label>
          <select id="image-position-input"
            name="image-position"
            ref={imagePositionRef}
            onChange={updateMembersStore}>
            <option value="1" selected={member.image_position === 1}>Oben Links</option>
            <option value="2" selected={member.image_position === 2}>Oben Rechts</option>
            <option value="3" selected={member.image_position === 3}>Unten Links</option>
            <option value="4" selected={member.image_position === 4}>Unten Rechts</option>
          </select>

        </div>

        <div className="member-description">
          <textarea defaultValue={member.description}
            ref={descriptionRef}
            onChange={updateMembersStore}>
          </textarea>
        </div>

      </div>
    </div>
  );
}

export default MemberRow;
