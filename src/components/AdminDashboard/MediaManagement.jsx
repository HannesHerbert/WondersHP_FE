import { useState, useEffect } from "react";
import axios from "axios";
import { mediaUrl } from "../../config.js"; 
import useModalStore from "../../store/useModalStore.js";
import useNotificationStore from "../../store/useNotificationStore.js";
import useAuthStore from "../../store/useAuthStore.js";
import MediaUpload from "../ModalContent/MediaUpload.jsx";
import EditImageModal from "../ModalContent/EditImageModal.jsx";
import { FaEdit, FaTrash, FaFileAlt, FaMusic, FaVideo, FaImage } from "react-icons/fa";
import "../../sass/MediaManagement.scss";

const SECTIONS = [
  { key: 'images', label: 'Bilder', icon: <FaImage /> },
  { key: 'videos', label: 'Videos', icon: <FaVideo /> },
  { key: 'audio',  label: 'Audio',  icon: <FaMusic /> },
  { key: 'documents', label: 'Dokumente', icon: <FaFileAlt /> },
];

function MediaManagement() {
  const [activeSection, setActiveSection] = useState('images');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [documents, setDocuments] = useState([]);

  const setModalContent = useModalStore((state) => state.setModalContent);
  const setModalIsShown = useModalStore((state) => state.setModalIsShown);
  const showNotification = useNotificationStore((state) => state.showNotification);
  const token = useAuthStore((state) => state.getToken());

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchImages(); }, []);
  useEffect(() => { if (activeSection === 'videos') fetchVideos(); }, [activeSection]);
  useEffect(() => { if (activeSection === 'audio') fetchAudio(); }, [activeSection]);
  useEffect(() => { if (activeSection === 'documents') fetchDocuments(); }, [activeSection]);

  async function fetchImages() {
    try {
      const res = await axios.get('/api/admin/list-images', { headers });
      if (res.data.success) setImages(res.data.data);
    } catch (error) {
      console.error("Fehler beim Laden der Bilder:", error);
      showNotification("Fehler beim Laden der Bilder", "error");
    }
  }

  async function fetchVideos() {
    try {
      const res = await axios.get('/api/admin/list-videos', { headers });
      if (res.data.success) setVideos(res.data.data);
    } catch (error) {
      console.error("Fehler beim Laden der Videos:", error);
      showNotification("Fehler beim Laden der Videos", "error");
    }
  }

  async function fetchAudio() {
    try {
      const res = await axios.get('/api/admin/list-audio', { headers });
      if (res.data.success) setAudioFiles(res.data.data);
    } catch (error) {
      console.error("Fehler beim Laden der Audiodateien:", error);
      showNotification("Fehler beim Laden der Audiodateien", "error");
    }
  }

  async function fetchDocuments() {
    try {
      const res = await axios.get('/api/admin/list-documents', { headers });
      if (res.data.success) setDocuments(res.data.data);
    } catch (error) {
      console.error("Fehler beim Laden der Dokumente:", error);
      showNotification("Fehler beim Laden der Dokumente", "error");
    }
  }

  function refetchActive() {
    if (activeSection === 'images') fetchImages();
    else if (activeSection === 'videos') fetchVideos();
    else if (activeSection === 'audio') fetchAudio();
    else if (activeSection === 'documents') fetchDocuments();
  }

  function openUploadModal() {
    setModalContent("Datei hochladen", <MediaUpload onUploadSuccess={refetchActive} />);
    setModalIsShown(true);
  }

  function openEditModal(image) {
    setModalContent("Bild bearbeiten", <EditImageModal image={image} onConfirm={fetchImages} />);
    setModalIsShown(true);
  }

  async function deleteImage(id) {
    if (!window.confirm("Möchtest du dieses Bild wirklich löschen?")) return;
    try {
      await axios.delete(`/api/admin/image/${id}`, { headers });
      showNotification("Bild erfolgreich gelöscht", "success");
      fetchImages();
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      showNotification("Fehler beim Löschen des Bildes", "error");
    }
  }

  return (
    <div id="media-management">
      <div className="media-header">
        <nav className="media-section-nav">
          {SECTIONS.map(s => (
            <button
              key={s.key}
              className={`media-section-btn${activeSection === s.key ? ' active' : ''}`}
              onClick={() => setActiveSection(s.key)}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </nav>
        <button className="admin-btn btn-primary" onClick={openUploadModal}>Hochladen</button>
      </div>

      {/* BILDER */}
      {activeSection === 'images' && (
        <section className="media-section">
          {images.length === 0 && <p className="empty-hint">Keine Bilder vorhanden.</p>}
          <div className="image-gallery">
            {images.map((img) => (
              <div key={img.id} className="gallery-item">
                <img src={mediaUrl(`/media/images/${img.sourceUrlSM}`)} alt={img.title} className="gallery-image" />
                {img.isPublic && <span className="gallery-badge" title="Wird in der öffentlichen Galerie gezeigt">Galerie</span>}
                <div className="gallery-item-title"><p>{img.title}</p></div>
                <div className="gallery-item-actions">
                  <button onClick={() => openEditModal(img)} className="action-btn edit-btn" title="Bearbeiten"><FaEdit size={12} /></button>
                  <button onClick={() => deleteImage(img.id)} className="action-btn delete-btn" title="Löschen"><FaTrash size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* VIDEOS */}
      {activeSection === 'videos' && (
        <section className="media-section">
          {videos.length === 0 && <p className="empty-hint">Keine Videos vorhanden.</p>}
          <div className="video-list">
            {videos.map((vid) => (
              <div key={vid.id} className="video-item">
                <video src={mediaUrl(vid.sourceUrl)} controls className="video-preview" />
                <div className="video-item-info">
                  <p className="item-title">{vid.title}</p>
                  {vid.description && <p className="item-description">{vid.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AUDIO */}
      {activeSection === 'audio' && (
        <section className="media-section">
          {audioFiles.length === 0 && <p className="empty-hint">Keine Audiodateien vorhanden.</p>}
          <div className="audio-list">
            {audioFiles.map((file) => (
              <div key={file.filename} className="audio-item">
                <FaMusic className="audio-icon" />
                <div className="audio-item-info">
                  <p className="item-title">{file.filename}</p>
                  <audio src={mediaUrl(file.url)} controls className="audio-player" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DOKUMENTE */}
      {activeSection === 'documents' && (
        <section className="media-section">
          {documents.length === 0 && <p className="empty-hint">Keine Dokumente vorhanden.</p>}
          <div className="document-list">
            {documents.map((file) => (
              <div key={file.filename} className="document-item">
                <FaFileAlt className="document-icon" />
                <a href={mediaUrl(file.url)} target="_blank" rel="noopener noreferrer" className="item-title">{file.filename}</a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default MediaManagement