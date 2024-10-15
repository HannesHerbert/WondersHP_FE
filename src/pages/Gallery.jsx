import "../sass/Gallery.scss"
import GalleryImage from "../components/GalleryImage";



function Gallery() {

  let galleryImages = [];
  let imageSrc = 'https://picsum.photos/200/300'

  for (let i=0; i<=12; i++) {
    galleryImages.push(<GalleryImage key={i} imageUrl={imageSrc} />)
  }

  return (
    <section id="gallery">
      <div className="gallery-wrapper">
        {galleryImages}
      </div>
    </section>
  );
}

export default Gallery;
