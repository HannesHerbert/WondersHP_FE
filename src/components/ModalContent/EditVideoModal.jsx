import { useState } from "react";
import axios from "axios";
import useModalStore from "../../store/useModalStore.js";
import useNotificationStore from "../../store/useNotificationStore.js";
import useAuthStore from "../../store/useAuthStore.js";

// Video bearbeiten: Titel, Beschreibung und Sichtbarkeit in der Galerie (wie EditImageModal)
function EditVideoModal({ video, onConfirm }) {
    const [title, setTitle] = useState(video.title || "");
    const [description, setDescription] = useState(video.description || "");
    const [isPublic, setIsPublic] = useState(Boolean(video.isPublic));
    const [isSaving, setIsSaving] = useState(false);

    const setModalIsShown = useModalStore((state) => state.setModalIsShown);
    const showNotification = useNotificationStore((state) => state.showNotification);
    const token = useAuthStore((state) => state.getToken());

    async function handleSave() {
        setIsSaving(true);
        try {
            const response = await axios.put(`/api/admin/video/${video.id}`, { title, description, isPublic }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            showNotification("Video gespeichert", "success");
            if (onConfirm) onConfirm(response.data.data);
            setModalIsShown(false);
        } catch (error) {
            showNotification("Fehler beim Speichern des Videos", "error");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="admin-modal-content">
            <div className="admin-form-group">
                <label className="admin-label" htmlFor="video-title">Titel</label>
                <input id="video-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" />
            </div>

            <div className="admin-form-group">
                <label className="admin-label" htmlFor="video-description">Beschreibung</label>
                <textarea id="video-description" value={description} onChange={(e) => setDescription(e.target.value)} className="admin-textarea"></textarea>
            </div>

            <div className="admin-form-group">
                <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                    <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                    In Galerie anzeigen
                </label>
            </div>

            <div className="admin-modal-actions">
                <button onClick={() => setModalIsShown(false)} className="admin-btn btn-secondary">Abbrechen</button>
                <button onClick={handleSave} disabled={isSaving} className="admin-btn btn-primary">
                    {isSaving ? "Speichert..." : "Speichern"}
                </button>
            </div>
        </div>
    );
}

export default EditVideoModal;
