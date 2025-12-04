import { useState, useEffect } from "react";
import axios from "axios";
import Image from "../Snippets/Image";


function ImageSelect({ callback }) {

  let [imagesObjects, setImagesObjects] = useState([]);
  let [imageElements, setImageElements] = useState([]);

  async function fetchImages() {

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/admin/list-images`);

      setImagesObjects(response.data.data);
      console.log(response.data.data);
      

    } catch (error) {
      console.error("Fehler beim Abrufen der Bilder:", error);
    }
  };

  function createImages() {
    let elements = imagesObjects.map((image, index) => {

        return (
            // <Image key={index} image={image}/>
            <div key={index}>{image.title}</div>
          )
      })
      console.log(elements);
      

      setImageElements(elements);
  }

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    console.log(imagesObjects);
    if (imagesObjects.length > 0) {
      createImages();
    }
  }, [imagesObjects]);

  useEffect(() => {
    console.log(imageElements);
  }, [imageElements]);




  return (
    <div id="image-select">
      {/* {cloudImages} */}
    </div>
  )
}

export default ImageSelect