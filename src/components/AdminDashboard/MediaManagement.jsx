import { useState, useEffect } from "react";
import axios from "axios";
import { mediaUrl } from "../../config.js"; 
import useModalStore from "../../store/useModalStore.js";
import useNotificationStore from "../../store/useNotificationStore.js";
import useAuthStore from "../../store/useAuthStore.js";
import MediaUpload from "../ModalContent/MediaUpload.jsx";
import EditImageModal from "../ModalContent/EditImageModal.jsx";
import EditVideoModal from "../ModalContent/EditVideoModal.jsx";
import { FaEdit, FaTrash, FaFileAlt, FaMusic, FaVideo, FaImage, FaCheck, FaYoutube } from "react-icons/fa";
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

  // Sichtbarkeit in der öffentlichen Galerie direkt umschalten (Bilder und Videos)
  async function toggleGallery(kind, item) {
    const isPublic = !item.isPublic;
    try {
      await axios.put(`/api/admin/${kind}/${item.id}`, { isPublic }, { headers });
      const update = (list) => list.map((x) => (x.id === item.id ? { ...x, isPublic } : x));
      if (kind === 'image') setImages(update);
      else setVideos(update);
      showNotification(isPublic ? `„${item.title}“ erscheint in der Galerie` : `„${item.title}“ aus der Galerie genommen`, "success");
    } catch (error) {
      showNotification("Sichtbarkeit konnte nicht geändert werden", "error");
    }
  }

  function openEditVideoModal(video) {
    setModalContent("Video bearbeiten", <EditVideoModal video={video} onConfirm={fetchVideos} />);
    setModalIsShown(true);
  }

  async function deleteVideo(video) {
    if (!window.confirm(`Video „${video.title}“ wirklich löschen?`)) return;
    try {
      await axios.delete(`/api/admin/video/${video.id}`, { headers });
      showNotification("Video gelöscht", "success");
      fetchVideos();
    } catch (error) {
      showNotification("Fehler beim Löschen des Videos", "error");
    }
  }

  const [youtube, setYoutube] = useState({ url: '', title: '', isPublic: true });
  const [isAddingYoutube, setIsAddingYoutube] = useState(false);

  async function addYouTubeVideo(event) {
    event.preventDefault();
    setIsAddingYoutube(true);
    try {
      const res = await axios.post('/api/admin/video-youtube', youtube, { headers });
      showNotification(`„${res.data.data.title}“ hinzugefügt`, "success");
      setYoutube({ url: '', title: '', isPublic: youtube.isPublic });
      fetchVideos();
    } catch (error) {
      showNotification(error.response?.data?.message || "YouTube-Video konnte nicht hinzugefügt werden", "error");
    } finally {
      setIsAddingYoutube(false);
    }
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
          {images.length > 0 && (
            <p className="gallery-count">
              {images.filter((i) => i.isPublic).length} von {images.length} Bildern in der Galerie. Klick auf „In Galerie“ zum Umschalten.
            </p>
          )}
          <div className="image-gallery">
            {images.map((img) => (
              <div key={img.id} className="gallery-item">
                <img src={mediaUrl(`/media/images/${img.sourceUrlSM}`)} alt={img.title} className="gallery-image" />
                <button
                  type="button"
                  className={`gallery-toggle${img.isPublic ? ' on' : ''}`}
                  aria-pressed={Boolean(img.isPublic)}
                  onClick={() => toggleGallery('image', img)}
                  title={img.isPublic ? 'Aus der Galerie nehmen' : 'In der Galerie zeigen'}
                >
                  {img.isPublic ? <FaCheck size={10} /> : null} In Galerie
                </button>
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
          {videos.length > 0 && (
            <p className="gallery-count">
              {videos.filter((v) => v.isPublic).length} von {videos.length} Videos in der Galerie. Bei mehreren lässt sich dort durchblättern.
            </p>
          )}
          {/* YouTube-Video per Adresse hinzufügen – verhält sich danach wie ein hochgeladenes Video */}
          <form className="youtube-add" onSubmit={addYouTubeVideo}>
            <FaYoutube className="youtube-add-icon" aria-hidden="true" />
            <input
              type="url"
              required
              className="youtube-input"
              placeholder="YouTube-Adresse, z.B. https://youtu.be/…"
              aria-label="YouTube-Adresse"
              value={youtube.url}
              onChange={(e) => setYoutube({ ...youtube, url: e.target.value })}
            />
            <input
              type="text"
              className="youtube-input"
              placeholder="Titel (optional, sonst von YouTube)"
              aria-label="Titel"
              value={youtube.title}
              onChange={(e) => setYoutube({ ...youtube, title: e.target.value })}
            />
            <label className="youtube-public">
              <input type="checkbox" checked={youtube.isPublic} onChange={(e) => setYoutube({ ...youtube, isPublic: e.target.checked })} />
              In Galerie
            </label>
            <button type="submit" className="admin-btn btn-secondary" disabled={isAddingYoutube}>
              {isAddingYoutube ? 'Wird geladen …' : 'Hinzufügen'}
            </button>
          </form>

          {/* Gleiche Kacheln und Knöpfe wie bei den Bildern; Titel unter der Kachel, damit die Steuerung frei bleibt */}
          <div className="image-gallery video-gallery">
            {videos.map((vid) => (
              <figure key={vid.id} className="video-tile">
                <div className="gallery-item">
                  {vid.provider === 'youtube' ? (
                    <a className="youtube-tile" href={vid.sourceUrl} target="_blank" rel="noopener noreferrer" title="Auf YouTube öffnen">
                      {vid.posterUrl && <img src={mediaUrl(vid.posterUrl)} alt="" className="gallery-image" />}
                      <span className="youtube-badge"><FaYoutube aria-hidden="true" /> YouTube</span>
                    </a>
                  ) : (
                    <video src={mediaUrl(vid.sourceUrl)} controls preload="metadata" className="gallery-image" />
                  )}
                  <button
                    type="button"
                    className={`gallery-toggle${vid.isPublic ? ' on' : ''}`}
                    aria-pressed={Boolean(vid.isPublic)}
                    onClick={() => toggleGallery('video', vid)}
                    title={vid.isPublic ? 'Aus der Galerie nehmen' : 'In der Galerie zeigen'}
                  >
                    {vid.isPublic ? <FaCheck size={10} /> : null} In Galerie
                  </button>
                  <div className="gallery-item-actions">
                    <button onClick={() => openEditVideoModal(vid)} className="action-btn edit-btn" title="Bearbeiten" aria-label={`${vid.title} bearbeiten`}><FaEdit size={12} /></button>
                    <button onClick={() => deleteVideo(vid)} className="action-btn delete-btn" title="Löschen" aria-label={`${vid.title} löschen`}><FaTrash size={12} /></button>
                  </div>
                </div>
                <figcaption className="video-tile-title">{vid.title}</figcaption>
              </figure>
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