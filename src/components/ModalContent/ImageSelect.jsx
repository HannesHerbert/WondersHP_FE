import { useState, useEffect } from "react";
import axios from "axios";
import CloudinaryImage from "../Snippets/CloudinaryImage";


function ImageSelect ({ callback }) {
  const folder = 'wonders/images';
  const [cloudPublicIdsArr, setCloudPublicIdsArr] = useState([]);
  let [cloudImages, setCloudImages] = useState();

  useEffect(() => {
    const fetchImages = async () => {

      let params = {
        folder: folder
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/public/cloud`, {
          params: params
        });
        
        setCloudPublicIdsArr(response.data.publicIds);

      } catch (error) {
        console.error("Fehler beim Abrufen der Bilder:", error);
      }
    };

    fetchImages();
  }, []);


  useEffect(() =>{
    
    if(cloudPublicIdsArr.length != 0) {

      let viewport = window.screen.width

      let imgWidth

      if(viewport < 768) {
        imgWidth = 400
      } else if(viewport >= 768 && viewport < 1024) {
        imgWidth = 800
      } else {
        imgWidth = 1200
      }

      function setMembersImage(id) {
        console.log(id);
      }
      

      setCloudImages(cloudPublicIdsArr.map((publicId, index) => {
          return (
            <div className="image-wrapper" onClick={() => callback(publicId)}>
              <CloudinaryImage
                key={publicId}
                className="image-wrapper"
                publicId={publicId}
                size={imgWidth}
              />
            </div>
          )
        })
      )
    }

    console.log(cloudPublicIdsArr);
    

  }, [cloudPublicIdsArr])



  return (
    <div id="image-select">
      {cloudImages}
    </div>
  )
}

export default ImageSelect