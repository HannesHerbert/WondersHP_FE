import MemberRow from "./MemberRow";
import "../../sass/MembersManagement.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import useAdminSettingsStore from "../../store/useAdminSettingsStore";
import useAuthStore from "../../store/useAuthStore";
import useNotificationStore from "../../store/useNotificationStore";

function MembersManagement() {

  // const [membersArr, setMembersArr] = useState([]);
  const [isInit, setIsInit] = useState([true]);

  const setMembersArrStore = useAdminSettingsStore((state) => state.setMembersArray);
  const membersArrStore = useAdminSettingsStore((state) => state.membersArray);
  const token = useAuthStore((state) => state.getToken());
  const showNotification = useNotificationStore((state) => state.showNotification);

  const getAllMembers = async () => {
    try {
      let res = await axios.get(`/api/public/members`);
      setMembersArrStore(res.data.data);
    } catch (error) {
      console.error(error);
      showNotification("Fehler beim Laden der Mitglieder", "error");
    }
  };

  useEffect(() => {
    if (isInit) {
      getAllMembers();
      setIsInit(isInit => !isInit)
    }
  }, []);

  useEffect(() => {
    // console.log('CHANGE: ', membersArrStore);
    
  }, [membersArrStore]);

      const MEMBER_ROWS = (membersArrStore || []).map((member, index) => {

        return (
            <MemberRow key={index} member={member}/>
        )
      })

    async function updateMembers() {

        try {
            let res = await axios.put(`/api/admin/update-members`, membersArrStore, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(res)
            getAllMembers(); // Refresh after saving
            showNotification("Mitglieder erfolgreich gespeichert", "success");
        } catch (error) {
            console.log(error);
            showNotification("Fehler beim Speichern der Mitglieder", "error");
        }
    };

    function addNewMember() {
      const newMember = {
        id: `temp_${Date.now()}_${Math.random()}`,
        firstname: "Neues",
        lastname: "Mitglied",
        instrument: "Instrument",
        description: "Beschreibung",
        image_position: 1,
        isGuest: false,
        image_id: null,
        images: { sm: '', md: '', lg: '' }
      };
      setMembersArrStore([...membersArrStore, newMember]);
    }

    return (
        <div id="members-management">

            {MEMBER_ROWS}

            <div className="admin-modal-actions" style={{ justifyContent: 'flex-start' }}>
              <button className="admin-btn btn-secondary" onClick={addNewMember}>Neues Mitglied hinzufügen</button>
              <button className="admin-btn btn-secondary" onClick={getAllMembers}>Aktualisieren</button>
              <button className="admin-btn btn-primary" onClick={updateMembers}>Speichern</button>
            </div>
            
        </div>
    )
}

export default MembersManagement