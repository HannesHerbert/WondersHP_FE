import { useState, useRef } from "react";
import axios from "axios";
import useModalStore from "../../store/useModalStore.js";
import useNotificationStore from "../../store/useNotificationStore.js";
import useAuthStore from "../../store/useAuthStore.js";

function MediaUpload({ onUploadSuccess }) {
    const fileInputRef = useRef(null);
    const titleInputRef = useRef(null);
    const descriptionInputRef = useRef(null);
    
    const [isUploading, setIsUploading] = useState(false);
    const setModalIsShown = useModalStore((state) => state.setModalIsShown);
    const showNotification = useNotificationStore((state) => state.showNotification);
    const token = useAuthStore((state) => state.getToken());

    async function uploadMedia() {
        const file = fileInputRef.current.files[0];
        const title = titleInputRef.current.value;
        const description = descriptionInputRef.current.value;

        if (!file) {
            showNotification("Bitte wähle eine Datei aus.", "error");
            return;
        }

        // Check file size (max 100MB) to prevent 413 Payload Too Large errors from reverse proxy
        const maxSizeInBytes = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSizeInBytes) {
            showNotification("Die Datei ist zu groß. Bitte wähle eine Datei unter 100MB.", "error");
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);

        try {
            const response = await axios.post(`/api/admin/upload-media`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Upload erfolgreich:', response.data);
            showNotification("Upload erfolgreich!", "success");
            
            if (onUploadSuccess) onUploadSuccess();
            
            // Close modal after a short delay
            setTimeout(() => {
                setModalIsShown(false);
            }, 1500);
            
        } catch (error) {
            console.error('Fehler beim Upload:', error);
            if (error.message === 'Network Error') {
                showNotification("Netzwerkfehler: Möglicherweise ist die Datei zu groß für den Server (Limit überschritten).", "error");
            } else {
                showNotification("Fehler beim Upload: " + (error.response?.data?.error || error.message), "error");
            }
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="admin-modal-content">
            <div className="admin-form-group">
                <label className="admin-label">Datei auswählen</label>
                <input type="file" ref={fileInputRef} className="admin-input" />
            </div>
            
            <div className="admin-form-group">
                <label className="admin-label">Titel (optional)</label>
                <input type="text" placeholder="Titel eingeben" ref={titleInputRef} className="admin-input" />
            </div>
            
            <div className="admin-form-group">
                <label className="admin-label">Beschreibung (optional)</label>
                <textarea placeholder="Beschreibung eingeben" ref={descriptionInputRef} className="admin-textarea"></textarea>
            </div>
            
            <div className="admin-modal-actions">
                <button 
                    onClick={uploadMedia} 
                    disabled={isUploading}
                    className="admin-btn btn-primary"
                >
                    {isUploading ? 'Wird hochgeladen...' : 'Hochladen'}
                </button>
            </div>
        </div>
    )
}

export default MediaUpload;