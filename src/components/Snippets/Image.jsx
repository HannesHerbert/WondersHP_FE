import { useState, useEffect } from "react";
import axios from "axios";


function Image({ imageObject }) {

  const { images, altText, className } = imageObject;
  // const baseUrl = import.meta.env.BASE_URL.substring(1, import.meta.env.BASE_URL.length - 1);/media/images
  const baseUrl = import.meta.env.VITE_MEDIA_DIR;

  return (
    <picture>
      {/* Entferne type oder verwende echte WebP */}
      <source
        srcSet={`
      ${baseUrl + images.sm} 300w,
      ${baseUrl + images.md} 800w,
      ${baseUrl + images.lg} 1920w
    `}
        sizes="(max-width: 450px) 35vw, (max-width: 760px) 36vw, 800px"
      />
      {/* Fallback mit srcset */}
      <img
        src={baseUrl + images.lg}
        srcSet={`
      ${baseUrl + images.sm} 300w,
      ${baseUrl + images.md} 800w,
      ${baseUrl + images.lg} 1920w
    `}
        sizes="(max-width: 450px) 35vw, (max-width: 760px) 36vw, 800px"
        alt={altText}
        className={className}
        loading="lazy"
      />
    </picture>
  );
}

export default Image;