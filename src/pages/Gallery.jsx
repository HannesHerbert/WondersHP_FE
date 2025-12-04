import "../sass/Gallery.scss"
import GalleryImage from "../components/Snippets/GalleryImage";
import VideoPlayer from "../components/Home/VideoPlayer";
import galImg1 from "../assets/images/1a248d9e-d7a8-4176-a732-4426a4f3d10f.webp";
import galImg2 from "../assets/images/3c64ce1c-0888-4b10-ae93-ee122bd8546c.webp";
import galImg3 from "../assets/images/5c1f3b0c-d58e-4d2b-becf-9935270ca2fe.webp";
import galImg4 from "../assets/images/6d6ed482-15a1-4653-9677-2c802e5e3c61.webp";
import galImg5 from "../assets/images/7ed065b8-3a2f-41cb-aba7-5990ca00e91d.webp";
import galImg6 from "../assets/images/8af71778-6018-410d-b453-b910c3e32397.webp";
import galImg7 from "../assets/images/9d2da99f-1a78-4d93-bdc7-d4b359dc92b3.webp";
import galImg8 from "../assets/images/9e924b7a-9995-4ef1-a272-bb7a10a8fe0c.webp";
import galImg9 from "../assets/images/b7adafa5-400d-4e6b-acde-7d9459addec7.webp";
import galImg10 from "../assets/images/d2b87d9c-2860-4de6-bfe7-1c8b5e453157.webp";
import galImg11 from "../assets/images/f2be344a-5511-4dd2-81f2-9c07775eeb9c.webp";
import useGalleryStore from "../store/useGalleryStore.js";
import { useEffect } from "react";



function Gallery() {

  const setGalleryElements = useGalleryStore((state) => state.setGalleryElements);
  const galleryElements = useGalleryStore((state) => state.galleryElements);

  let images = [
    {
      src: galImg1,
      title: 'something',
      tag: 'img'
    },
    {
      src: galImg2,
      title: 'something',
      tag: 'img'
    },
    {
      src: galImg3,
      title: 'something',
      tag: 'img'
    },
    {
      src: galImg4,
      title: 'something',
      tag: 'img'
    },
    {
      src: galImg5,
      title: 'something',
      tag: 'img'
    },
    {
      src: galImg6,
      title: 'something',
      tag: 'img'
    },
    {
      src: galImg7,
      title: 'something',
      tag: 'img'
    },
    {
      src: galImg8,
      title: 'something',
      tag: 'img'
    },
    {
      src: galImg9,
      title: 'something',
      tag: 'img'
    },
    {
      src: galImg10,
      title: 'something',
      tag: 'img'
    },
    {
      src: galImg11,
      title: 'something',
      tag: 'img'
    },
  ];

  useEffect(() => {
    setGalleryElements(images);
  }, []);

  useEffect(() => {
    console.log(galleryElements);
  }, [galleryElements]);

  let galleryImages = images.map((image, index) => {
    return (
      <GalleryImage key={index} imageIndex={index} imageUrl={image.src} imageTitle={image.title} />
    )
  })

  return (
    <section id="gallery">

      {/* <div id="top-video-wrapper">
        <VideoPlayer />
      </div> */}

      <div className="gallery-wrapper">
        {galleryImages}
      </div>
    </section>
  );
}

export default Gallery;
