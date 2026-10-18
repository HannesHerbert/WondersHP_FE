import { useState, useEffect, useRef } from "react";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import useNotificationStore from "../../store/useNotificationStore";
import useModalStore from "../../store/useModalStore";
import ImageSelect from "../ModalContent/ImageSelect";
import Image from "../Snippets/Image";
import BookingTeaserManagement from "./BookingTeaserManagement";
import SocialLinksManagement from "./SocialLinksManagement";

function BandManagement() {
  const [heroData, setHeroData] = useState({ title: "", text: "", image_id: null, images: null });
  const [isLoading, setIsLoading] = useState(true);
  
  const titleRef = useRef();
  const textRef = useRef();
  
  const token = useAuthStore((state) => state.getToken());
  const showNotification = useNotificationStore((state) => state.showNotification);
  const setModalContent = useModalStore((state) => state.setModalContent);
  const setModalIsShown = useModalStore((state) => state.setModalIsShown);

  useEffect(() => {
    fetchHeroArea();
  }, []);

  async function fetchHeroArea() {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/public/hero-area');
      if (res.data.success) {
        setHeroData(res.data.data);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Hero Area", error);
      showNotification("Fehler beim Laden der Hero Area", "error");
    } finally {
      setIsLoading(false);
    }
  }

  async function saveHeroArea() {
    try {
      const payload = {
        title: titleRef.current.value,
        text: textRef.current.value,
        image_id: heroData.image_id
      };

      const res = await axios.put('/api/admin/update-hero-area', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setHeroData(res.data.data);
        showNotification("Hero Area erfolgreich gespeichert", "success");
      }
    } catch (error) {
      console.error("Fehler beim Speichern", error);
      showNotification("Fehler beim Speichern der Hero Area", "error");
    }
  }

  function toggleImageSelectModal() {
    setModalContent(
      "Bild auswählen",
      <ImageSelect
        initialImageId={heroData.image_id}
        onConfirm={(imageId) => {
          // Update local state immediately, but don't save to DB yet
          setHeroData(prev => ({ ...prev, image_id: imageId }));
          setModalIsShown(false);
        }}
        onCancel={() => setModalIsShown(false)}
      />
    );
    setModalIsShown(true);
  }

  if (isLoading) return <div>Lade Daten...</div>;

  return (
    <div className="band-management" style={{ color: 'white' }}>
      <h3 style={{ marginBottom: '1.5rem', fontFamily: "'Righteous', sans-serif", fontWeight: 400, fontSize: '1.4rem' }}>Hero Bereich anpassen</h3>
      
      <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
        <label className="admin-label">Überschrift</label>
        <input 
          type="text" 
          className="admin-input" 
          defaultValue={heroData.title || ""} 
          ref={titleRef} 
        />
      </div>

      <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
        <label className="admin-label">Text</label>
        <textarea 
          className="admin-textarea" 
          defaultValue={heroData.text || ""} 
          ref={textRef} 
          style={{ minHeight: '150px' }}
        />
      </div>

      <div className="admin-form-group" style={{ marginBottom: '2rem' }}>
        <label className="admin-label">Hintergrundbild</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="admin-btn btn-secondary" onClick={toggleImageSelectModal}>
            Bild auswählen
          </button>
          {heroData.image_id && (
            <span style={{ fontSize: '0.9rem', color: '#aaa' }}>
              Bild ID: {heroData.image_id} ausgewählt. (Speichern klicken zum Übernehmen)
            </span>
          )}
        </div>
      </div>

      <div className="admin-modal-actions" style={{ justifyContent: 'flex-start' }}>
        <button className="admin-btn btn-primary" onClick={saveHeroArea}>
          Speichern
        </button>
      </div>

      <SocialLinksManagement />

      <BookingTeaserManagement />
    </div>
  );
}

export default BandManagement;
