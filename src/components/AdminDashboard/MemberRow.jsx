import { FaEdit, FaCropAlt } from "react-icons/fa";
import useModalStore from "../../store/useModalStore.js";
import ImageSelect from "../ModalContent/ImageSelect.jsx";
import MemberCropEditor from "./MemberCropEditor.jsx";
import useAdminSettingsStore from "../../store/useAdminSettingsStore.js";
import Image from "../Snippets/Image.jsx";
import { useRef } from "react";

function MemberRow({ member }) {

  const setModalContent = useModalStore((state) => state.setModalContent);
  const setModalIsShown = useModalStore((state) => state.setModalIsShown);
  const setMembersArrStore = useAdminSettingsStore((state) => state.setMembersArray);
  const membersArrStore = useAdminSettingsStore((state) => state.membersArray);

  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const instrumentRef = useRef();
  const imagePositionRef = useRef();
  const descriptionRef = useRef();

  // Position im Grid: im Uhrzeigersinn ab oben, 1 bis Anzahl der Mitglieder
  const positionCount = Math.max((membersArrStore || []).length, member.image_position || 1);
  const POSITION_OPTS = Array.from({ length: positionCount }, (_, i) => (
    <option key={i + 1} value={i + 1}>{i + 1}{i === 0 ? " (oben, dann im Uhrzeigersinn)" : ""}</option>
  ));


  function updateMemberImage(memberId, imageId) {
    const updatedMembers = (membersArrStore || []).map((mem) =>
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


  // Bildausschnitt im Dreieck des Mitglieder-Grids wählen
  function toggleCropModal() {
    setModalContent(
      `Bildausschnitt: ${`${member.firstname} ${member.lastname}`.trim()}`,
      <MemberCropEditor memberId={member.id} onClose={() => setModalIsShown(false)} />
    );
    setModalIsShown(true);
  }


  function updateMembersStore() {

    const newImagePosition = parseInt(imagePositionRef.current.value) || 1;
    const oldImagePosition = member.image_position || 1;

    // Falls sich die Position nicht geändert hat, normale Update-Logik
    if (newImagePosition === oldImagePosition) {
      const updatedMember = {
        ...member,
        firstname: firstnameRef.current.value || "",
        lastname: lastnameRef.current.value || "",
        instrument: instrumentRef.current.value || "",
        image_position: newImagePosition,
        description: descriptionRef.current.value || ""
      };

      const updatedMembersArr = (membersArrStore || []).map((mem) =>
        mem.id === member.id ? updatedMember : mem
      );

      setMembersArrStore(updatedMembersArr);
      return;
    }

    // Position hat sich geändert → Swap-Logik
    const updatedMembersArr = (membersArrStore || []).map((mem) => {
      if (mem.id === member.id) {
        // Aktuelles Member bekommt neue Position
        return {
          ...mem,
          firstname: firstnameRef.current.value || "",
          lastname: lastnameRef.current.value || "",
          instrument: instrumentRef.current.value || "",
          image_position: newImagePosition,
          description: descriptionRef.current.value || ""
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
          images: member.images || { sm: '', md: '', lg: '' },
          altText: `${member.firstname} ${member.lastname}`,
          className: "member-img-element"
        }} />

        {member.images?.md && (
          <span className="crop-btn" title="Bildausschnitt im Grid wählen" onClick={toggleCropModal}>
            <FaCropAlt />
          </span>
        )}

        <span title="Bild ändern" onClick={toggleImageSelectModal}>
          <FaEdit />
        </span>
      </div>

      <div className="member-informations">

        <div className="member-name">

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="firstname-input">Vorname:</label>
            <input type="text"
              className="admin-input"
              id="firstname-input"
              name="firstname"
              value={member.firstname}
              ref={firstnameRef}
              onChange={updateMembersStore}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="lastname-input">Nachname:</label>
            <input type="text"
              className="admin-input"
              id="lastname-input"
              name="lastname"
              value={member.lastname}
              ref={lastnameRef}
              onChange={updateMembersStore}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="instrument-input">Instrument:</label>
            <input type="text"
              className="admin-input"
              id="instrument-input"
              name="instrument"
              value={member.instrument}
              ref={instrumentRef}
              onChange={updateMembersStore}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor={`image-position-${member.id}`}>Position im Grid:</label>
            <select id={`image-position-${member.id}`}
              className="admin-select"
              name="image-position"
              ref={imagePositionRef}
              onChange={updateMembersStore}
              value={member.image_position}>
              {POSITION_OPTS}
            </select>
          </div>

        </div>

        <div className="member-description">
          <div className="admin-form-group" style={{ height: '100%' }}>
            <textarea value={member.description}
              className="admin-textarea"
              style={{ height: '100%' }}
              ref={descriptionRef}
              onChange={updateMembersStore}>
            </textarea>
            <small className="admin-hint">
              HTML erlaubt, z.B. Links: {'<a href="allflavours.de">All Flavours</a>'} · fett: {'<b>…</b>'} · kursiv: {'<i>…</i>'}
            </small>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MemberRow;
