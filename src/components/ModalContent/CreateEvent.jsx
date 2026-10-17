import { useRef, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import useNotificationStore from "../../store/useNotificationStore";

function CreateEvent({ onConfirm, onCancel, eventObj }) {
  const token = useAuthStore((state) => state.getToken());
  const showNotification = useNotificationStore((state) => state.showNotification);

  const dateRef = useRef();
  const timeRef = useRef();
  const venueRef = useRef();
  const linkRef = useRef();
  const streetRef = useRef();
  const numberRef = useRef();
  const postalCodeRef = useRef();
  const cityRef = useRef();
  const isPublicRef = useRef();

  // Edit-Mode? (wenn eventObj übergeben wird)
  const isEditMode = !!eventObj;

  // Felder beim Editieren vorbefüllen (falls du nicht defaultValue nutzen willst)
  useEffect(() => {
    if (!isEditMode || !eventObj) return;

    if (dateRef.current) dateRef.current.value = eventObj.date || "";
    if (timeRef.current) timeRef.current.value = eventObj.time || "";
    if (venueRef.current) venueRef.current.value = eventObj.venue || "";
    if (linkRef.current) linkRef.current.value = eventObj.link || "";
    if (streetRef.current) streetRef.current.value = eventObj.street || "";
    if (numberRef.current) numberRef.current.value = eventObj.number || "";
    if (postalCodeRef.current) postalCodeRef.current.value = eventObj.postalCode || "";
    if (cityRef.current) cityRef.current.value = eventObj.city || "";
    if (isPublicRef.current) isPublicRef.current.checked = !!eventObj.isPublic;
  }, [isEditMode, eventObj]);

  const collectEventData = () => ({
    date: dateRef.current.value,
    time: timeRef.current.value,
    venue: venueRef.current.value,
    link: linkRef.current.value,
    street: streetRef.current.value,
    number: numberRef.current.value,
    postalCode: postalCodeRef.current.value,
    city: cityRef.current.value,
    isPublic: isPublicRef.current.checked,
  });

  const handleSave = async () => {
    const payload = collectEventData();

    try {
      let res;
      if (isEditMode) {
        // EVENT BEARBEITEN
        res = await axios.put(
          `/api/admin/update-event`,
          { id: eventObj.id, ...payload },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showNotification("Event erfolgreich aktualisiert", "success");
      } else {
        // NEUES EVENT ANLEGEN
        res = await axios.post(
          `/api/admin/create-event`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showNotification("Event erfolgreich erstellt", "success");
      }

      console.log(res);
      if (onConfirm) onConfirm(res.data); // Parent z.B. Liste refreshen / Modal schließen
    } catch (error) {
      console.error(error);
      showNotification("Fehler beim Speichern des Events", "error");
    }
  };

  return (
    <div id="create-event" className="admin-modal-content">
      <div className="input-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="input-group-general" style={{ flex: 1, minWidth: '250px' }}>
          <div className="admin-form-group">
            <label className="admin-label" htmlFor="date-input">Datum:</label>
            <input
              type="date"
              className="admin-input"
              id="date-input"
              name="date"
              ref={dateRef}
              defaultValue={eventObj?.date || ""}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="time-input">Uhrzeit:</label>
            <input
              type="time"
              className="admin-input"
              id="time-input"
              name="time"
              ref={timeRef}
              defaultValue={eventObj?.time || ""}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="venue-input">Veranstaltungsort:</label>
            <input
              type="text"
              className="admin-input"
              id="venue-input"
              name="venue"
              ref={venueRef}
              defaultValue={eventObj?.venue || ""}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="link-input">Verlinkung:</label>
            <input
              type="text"
              className="admin-input"
              id="link-input"
              name="link"
              ref={linkRef}
              defaultValue={eventObj?.link || ""}
            />
          </div>
        </div>

        <div className="input-group-address" style={{ flex: 1, minWidth: '250px' }}>
          <div className="admin-form-group">
            <label className="admin-label" htmlFor="street-input">Straße:</label>
            <input
              type="text"
              className="admin-input"
              id="street-input"
              name="street"
              ref={streetRef}
              defaultValue={eventObj?.street || ""}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="number-input">Hausnummer:</label>
            <input
              type="text"
              className="admin-input"
              id="number-input"
              name="number"
              ref={numberRef}
              defaultValue={eventObj?.number || ""}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="postal-code-input">Postleitzahl:</label>
            <input
              type="text"
              className="admin-input"
              id="postal-code-input"
              name="postalCode"
              ref={postalCodeRef}
              defaultValue={eventObj?.postalCode || ""}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="city-input">Stadt:</label>
            <input
              type="text"
              className="admin-input"
              id="city-input"
              name="city"
              ref={cityRef}
              defaultValue={eventObj?.city || ""}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
        <input
          type="checkbox"
          name="isPublic"
          id="is-public-event-input"
          ref={isPublicRef}
          defaultChecked={eventObj?.isPublic || false}
          style={{ width: '1.2rem', height: '1.2rem' }}
        />
        <label className="admin-label" htmlFor="is-public-event-input" style={{ margin: 0 }}>Öffentliche Veranstaltung</label>
      </div>

      <div className="admin-modal-actions">
        <button type="button" className="admin-btn btn-secondary" onClick={onCancel}>
          Abbrechen
        </button>

        <button
          type="button"
          className="admin-btn btn-primary"
          onClick={handleSave}
        >
          {isEditMode ? "Speichern" : "Anlegen"}
        </button>
      </div>
    </div>
  );
}

export default CreateEvent;
