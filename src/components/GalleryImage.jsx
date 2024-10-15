function GalleryImage ({imageUrl}) {

    return(
        <div className="gallery-image-wrapper">
            <img src={imageUrl} alt="{imageUrl}" />
            <div className="image-text">
                <p>Placeholder</p>
            </div>
        </div>
    )
}

export default GalleryImage