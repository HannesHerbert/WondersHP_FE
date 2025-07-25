import { useState, useEffect } from "react";
import axios from "axios";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";

function CloudinaryImage({ publicId, size, className }) {

  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    },
  });
  const img = cld.image(publicId).resize(fill().width(size));

  return (
    <AdvancedImage cldImg={img} className={className || ''}/>
  );
}

export default CloudinaryImage;