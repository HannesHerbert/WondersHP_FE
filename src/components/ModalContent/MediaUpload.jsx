import { useState, useEffect, useRef } from "react";
import axios from "axios";


function MediaUpload() {

    const fileInputRef = useRef(null);
    const titleInputRef = useRef(null);
    const descriptionInputRef = useRef(null);


    function uploadMedia() {
        try {
            const file = fileInputRef.current.files[0];
            const title = titleInputRef.current.value;
            const description = descriptionInputRef.current.value;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', title);
            formData.append('description', description);

            axios.post(`${import.meta.env.VITE_BASE_API_URL}/admin/upload-media`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                console.log('Upload erfolgreich:', response.data);
            })
            .catch(error => {
                console.error('Fehler beim Upload:', error);
            });
            
        } catch (error) {
            console.error('Fehler beim Upload:', error);
        }
    }


    return (
        <div>
            <input type="file" ref={fileInputRef} />
            <input type="text" placeholder="Title" ref={titleInputRef} />
            <textarea placeholder="Description" ref={descriptionInputRef} ></textarea>
            <button onClick={uploadMedia}>Upload</button>
        </div>

    )
}

export default MediaUpload;