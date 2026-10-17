import MemberRow from "./MemberRow";
import "../../sass/MembersManagement.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import useAdminSettingsStore from "../../store/useAdminSettingsStore";
import useAuthStore from "../../store/useAuthStore";
import CreateEvent from "../ModalContent/CreateEvent";
import useModalStore from "../../store/useModalStore";
import DateElement from "../Home/DateElement";
import '../../sass/EventManagement.scss';
import { MdOutlineDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import useNotificationStore from "../../store/useNotificationStore";

function EventManagement() {
    const [eventsArr, setEventsArr] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const setModalContent = useModalStore((state) => state.setModalContent);
    const setModalIsShown = useModalStore((state) => state.setModalIsShown);
    let token = useAuthStore.getState().getToken();
    const showNotification = useNotificationStore((state) => state.showNotification);

    const getAllEvents = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`/api/public/events`);
            const data = res.data.data || res.data;
            setEventsArr(Array.isArray(data) ? data : []);  // Flexibel für API-Response
        } catch (error) {
            console.error('Fehler beim Laden der Events:', error);
            setEventsArr([]);
            showNotification("Fehler beim Laden der Events", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // EINZIGER useEffect für Initial-Load
    useEffect(() => {
        getAllEvents();
    }, []);

    function toggleEventModal(eventObj) {

        if (eventObj) {
            console.log('EDITING EVENT: ', eventObj);

            setModalContent(
                "Veranstaltung bearbeiten",
                <CreateEvent
                    onConfirm={() => {
                        setModalIsShown(false);
                        getAllEvents();
                    }}
                    onCancel={() => setModalIsShown(false)}
                    eventObj={eventObj}
                />
            );

        } else {
            console.log('CREATING NEW EVENT');

            setModalContent(
                "Neue Veranstaltung erstellen",
                <CreateEvent
                    onConfirm={() => {
                        setModalIsShown(false);
                        getAllEvents();
                    }}
                    onCancel={() => setModalIsShown(false)}
                />
            );
        }

        setModalIsShown(true);
    }

    if (isLoading) return <div>Lade Events...</div>;

    async function deleteEvent(id) {

        console.log(id);
        const dateId = { id: id };

        try {
            let res = await axios.delete(`/api/admin/delete-event`, {
                data: dateId,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(res)

            getAllEvents();
            showNotification("Event erfolgreich gelöscht", "success");

        } catch (error) {
            console.error('Fehler beim Löschen des Events:', error);
            showNotification("Fehler beim Löschen des Events", "error");
        }
    }

    const dateElems = (Array.isArray(eventsArr) ? eventsArr : []).map((event) => (

        <div key={event.id || event.date} className="event-row">
            <DateElement key={event.id || event.date} dateObj={event} />

            <div className="event-actions">
                <span title="Bearbeiten" onClick={() => toggleEventModal(event)}><FaEdit className="edit-icon" /></span>
                <span title="Löschen" onClick={() => deleteEvent(event.id)}><MdOutlineDeleteForever className="delete-icon" /></span>
            </div>
        </div>

    ));

    return (
        <div id="event-management">
            <div className="admin-modal-actions" style={{ justifyContent: 'flex-start', marginBottom: '2rem' }}>
                <button className="admin-btn btn-secondary" onClick={getAllEvents}>Aktualisieren</button>
                <button className="admin-btn btn-primary" onClick={() => toggleEventModal(null)}>Neue Veranstaltung erstellen</button>
            </div>
            <div id="events-list">
                {dateElems.length > 0 ? dateElems : <p>Keine Events gefunden</p>}
            </div>
        </div>
    );
}


export default EventManagement;