import MemberRow from "./MemberRow";
import "../../sass/MembersManagement.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import useAdminSettingsStore from "../../store/useAdminSettingsStore";
import useAuthStore from "../../store/useAuthStore";




function EventManagement() {


    async function updateMembers() {

        try {
            let res = await axios.put(`${import.meta.env.VITE_BASE_API_URL}/admin/update-members`, membersArrStore, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(res)

        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div id="event-management">

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


            <div>
                <button onClick={getAllMembers}>Aktualisieren</button>
                <button onClick={updateMembers}>Speichern</button>
            </div>

        </div>
    )
}

export default EventManagement