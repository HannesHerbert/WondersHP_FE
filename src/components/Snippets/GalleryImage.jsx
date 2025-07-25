function GalleryImage ({imageUrl, imageTitle}) {

    return(
        <div className="gallery-image-wrapper">
            <img src={imageUrl} alt="{imageUrl}" />
            <div className="image-text">
                <p>{imageTitle}</p>
            </div>
        </div>
    )
}

export default GalleryImage