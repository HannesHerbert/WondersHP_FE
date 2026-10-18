import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import useModalStore from "../../store/useModalStore.js";
import useNotificationStore from "../../store/useNotificationStore.js";
import useAuthStore from "../../store/useAuthStore.js";
import "../../sass/MediaUpload.scss";

const MAX_BYTES = 100 * 1024 * 1024;
const FULL_CROP = { unit: "%", x: 0, y: 0, width: 100, height: 100 };

/** Größter mittiger Ausschnitt im gewünschten Seitenverhältnis */
function centeredAspectCrop(aspect, imageWidth, imageHeight) {
    return centerCrop(makeAspectCrop({ unit: "%", width: 100 }, aspect, imageWidth, imageHeight), imageWidth, imageHeight);
}

function MediaUpload({ onUploadSuccess }) {
    const fileInputRef = useRef(null);
    const imageRef = useRef(null);

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    // Seitenverhältnis Breite : Höhe – beide leer = freier Ausschnitt
    const [ratioW, setRatioW] = useState("");
    const [ratioH, setRatioH] = useState("");
    const [crop, setCrop] = useState(FULL_CROP);
    const [isUploading, setIsUploading] = useState(false);

    const setModalIsShown = useModalStore((state) => state.setModalIsShown);
    const showNotification = useNotificationStore((state) => state.showNotification);
    const token = useAuthStore((state) => state.getToken());

    const aspect = Number(ratioW) > 0 && Number(ratioH) > 0 ? Number(ratioW) / Number(ratioH) : undefined;
    const isImage = file?.type.startsWith("image/");

    // Vorschau-URL für das gewählte Bild (und wieder freigeben)
    useEffect(() => {
        if (!file || !isImage) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    // Neues Seitenverhältnis → Ausschnitt mittig im neuen Format
    useEffect(() => {
        const img = imageRef.current;
        if (!img) return;
        setCrop(aspect ? centeredAspectCrop(aspect, img.naturalWidth, img.naturalHeight) : FULL_CROP);
    }, [aspect]);

    function onImageLoad(event) {
        const { naturalWidth, naturalHeight } = event.currentTarget;
        setCrop(aspect ? centeredAspectCrop(aspect, naturalWidth, naturalHeight) : FULL_CROP);
    }

    function selectFile(event) {
        const selected = event.target.files?.[0] || null;
        setFile(selected);
        setCrop(FULL_CROP);
        if (selected && !title) setTitle(selected.name.replace(/\.[^.]+$/, ""));
    }

    async function uploadMedia() {
        if (!file) {
            showNotification("Bitte wähle eine Datei aus.", "error");
            return;
        }
        // Größe vorab prüfen, sonst bricht der Reverse-Proxy mit 413 ab
        if (file.size > MAX_BYTES) {
            showNotification("Die Datei ist zu groß. Bitte wähle eine Datei unter 100 MB.", "error");
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);
        if (isImage && crop?.width && crop?.height) {
            formData.append("crop", JSON.stringify({ x: crop.x, y: crop.y, width: crop.width, height: crop.height }));
        }

        try {
            await axios.post(`/api/admin/upload-media`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            showNotification("Upload erfolgreich!", "success");
            if (onUploadSuccess) onUploadSuccess();
            setTimeout(() => setModalIsShown(false), 800);
        } catch (error) {
            console.error("Fehler beim Upload:", error);
            if (error.message === "Network Error") {
                showNotification("Netzwerkfehler: Möglicherweise ist die Datei zu groß für den Server (Limit überschritten).", "error");
            } else {
                showNotification("Fehler beim Upload: " + (error.response?.data?.message || error.message), "error");
            }
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="admin-modal-content media-upload">
            <div className="admin-form-group">
                <label className="admin-label" htmlFor="upload-file">Datei auswählen</label>
                <input id="upload-file" type="file" ref={fileInputRef} className="admin-input" onChange={selectFile} />
            </div>

            {previewUrl && (
                <div className="admin-form-group">
                    <div className="crop-header">
                        <span className="admin-label">Bildausschnitt</span>

                        {/* Seitenverhältnis über zwei Felder, z.B. 16 : 9 – leer = frei */}
                        <div className="ratio-inputs" role="group" aria-label="Seitenverhältnis">
                            <input
                                type="number"
                                min="1"
                                inputMode="numeric"
                                className="admin-input"
                                placeholder="Breite"
                                aria-label="Seitenverhältnis Breite"
                                value={ratioW}
                                onChange={(e) => setRatioW(e.target.value)}
                            />
                            <span aria-hidden="true">:</span>
                            <input
                                type="number"
                                min="1"
                                inputMode="numeric"
                                className="admin-input"
                                placeholder="Höhe"
                                aria-label="Seitenverhältnis Höhe"
                                value={ratioH}
                                onChange={(e) => setRatioH(e.target.value)}
                            />
                            {(ratioW || ratioH) && (
                                <button type="button" className="admin-btn btn-secondary ratio-reset" onClick={() => { setRatioW(""); setRatioH(""); }}>
                                    Frei
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="crop-area">
                        <ReactCrop
                            crop={crop}
                            aspect={aspect}
                            keepSelection
                            ruleOfThirds
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                        >
                            <img ref={imageRef} src={previewUrl} alt="Vorschau des gewählten Bildes" onLoad={onImageLoad} />
                        </ReactCrop>
                    </div>
                    <small className="admin-hint">
                        Rahmen ziehen oder an den Ecken anpassen. {aspect ? `Seitenverhältnis ${ratioW} : ${ratioH} ist fest.` : "Ohne Seitenverhältnis ist der Ausschnitt frei."}
                    </small>
                </div>
            )}

            <div className="admin-form-group">
                <label className="admin-label" htmlFor="upload-title">Titel (optional)</label>
                <input id="upload-title" type="text" placeholder="Titel eingeben" value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" />
            </div>

            <div className="admin-form-group">
                <label className="admin-label" htmlFor="upload-description">Beschreibung (optional)</label>
                <textarea id="upload-description" placeholder="Beschreibung eingeben" value={description} onChange={(e) => setDescription(e.target.value)} className="admin-textarea"></textarea>
            </div>

            <div className="admin-modal-actions">
                <button onClick={uploadMedia} disabled={isUploading} className="admin-btn btn-primary">
                    {isUploading ? "Wird hochgeladen..." : "Hochladen"}
                </button>
            </div>
        </div>
    );
}

export default MediaUpload;
