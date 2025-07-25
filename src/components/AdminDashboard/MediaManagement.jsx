import CloudUpload from "./CloudUpload";
import { useState, useEffect } from "react";
import axios from "axios";




function MediaManagement() {

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const [isInit, setIsInit] = useState([true]);
  const folder = 'wonders/images'
  const cloudAPI = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/folder/${folder}`;


  useEffect(() => {
    // if (isInit) {
    //   getAllMembers();
    //   setIsInit(isInit => !isInit)
    // }
    const fetchImages = async () => {

      let params = {
        folder: folder
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/public/cloud`, {
          params: params
        });
        console.log(response.data);
      } catch (error) {
        console.error("Fehler beim Abrufen der Bilder:", error);
      }
    };

    fetchImages();
  }, []);


    return (
        <div id="media-management">

          <section className="media-upload">
            <CloudUpload />
          </section>
            
        </div>
    )
}

export default MediaManagement