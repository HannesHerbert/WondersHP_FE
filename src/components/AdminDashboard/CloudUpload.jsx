import { useState, useEffect, useRef } from "react";
import axios from "axios";
// import cloudinary from "cloudinary";
import { Cloudinary } from "@cloudinary/url-gen";

function CloudUpload() {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();


  useEffect(() => {
    cloudinaryRef.current= window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget({
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      uploadPreset:import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_NAME
    }, function(err, res) {
      console.log(res)
  })
  }, []);

  return(
    <button onClick={() => widgetRef.current.open()}>
      UPLOAD
    </button>
  )
}

export default CloudUpload;
