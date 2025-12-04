import { useState, useEffect } from "react";
import axios from "axios";

function Image({ imageObject }) {

    

    return (
        <picture>
            <source srcSet="/media/images/uuid_lg.webp" media="(min-width: 1200px)" />
            <source srcSet="/media/images/uuid_md.webp" media="(min-width: 768px)" />
            <img src="/media/images/uuid_sm.webp" alt="Responsive" />
        </picture>
    );
}

export default Image;