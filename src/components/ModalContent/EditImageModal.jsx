import { useState } from "react";
import axios from "axios";
import useModalStore from "../../store/useModalStore.js";
import useNotificationStore from "../../store/useNotificationStore.js";
import useAuthStore from "../../store/useAuthStore.js";

function EditImageModal({ image, onConfirm }) {
    const [title, setTitle] = useState(image.title || "");
    const [description, setDescription] = useState(image.description || "");
    const [isPublic, setIsPublic] = useState(Boolean(image.isPublic));
    const [isSaving, setIsSaving] = useState(false);
    
    const setModalIsShown = useModalStore((state) => state.setModalIsShown);
    const showNotification = useNotificationStore((state) => state.showNotification);
    const token = useAuthStore((state) => state.getToken());

    async function handleSave() {
        setIsSaving(true);
        try {
            const response = await axios.put(`/api/admin/image/${image.id}`, {
                title,
                description,
                isPublic
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            showNotification("Bildinformationen erfolgreich aktualisiert", "success");
            if (onConfirm) onConfirm(response.data.data);
            setModalIsShown(false);
        } catch (error) {
            console.error('Fehler beim Aktualisieren:', error);
            showNotification("Fehler beim Aktualisieren der Bildinformationen", "error");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="admin-modal-content">
            <div className="admin-form-group">
                <label className="admin-label">Titel</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="admin-input" 
                />
            </div>
            
            <div className="admin-form-group">
                <label className="admin-label">Beschreibung</label>
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className="admin-textarea"
                ></textarea>
            </div>
            
            <div className="admin-form-group">
                <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    In Galerie anzeigen
                </label>
            </div>

            <div className="admin-modal-actions">
                <button 
                    onClick={() => setModalIsShown(false)}
                    className="admin-btn btn-secondary"
                >
                    Abbrechen
                </button>
                <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="admin-btn btn-primary"
                >
                    {isSaving ? 'Speichert...' : 'Speichern'}
                </button>
            </div>
        </div>
    );
}

export default EditImageModal;
