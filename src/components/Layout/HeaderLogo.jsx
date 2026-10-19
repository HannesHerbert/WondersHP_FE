import { useEffect, useState } from "react";
import axios from "axios";
import Logo from "./Logo";
import { mediaUrl } from "../../config.js";

// Logo im Header: im Dashboard (Content → Header) gewähltes Bild, sonst das animierte Standard-Logo
function HeaderLogo() {
  const [logo, setLogo] = useState(undefined); // undefined = lädt noch, null = Standard-Logo

  useEffect(() => {
    const load = () =>
      axios.get("/api/public/header")
        .then((res) => setLogo(res.data.data?.logo || null))
        .catch(() => setLogo(null));
    load();
    window.addEventListener("header-content-updated", load);
    return () => window.removeEventListener("header-content-updated", load);
  }, []);

  if (logo === undefined) return <span className="header-logo-placeholder" aria-hidden="true" />;
  // Standard-Logo: breite Variante füllt den Header auf dem Desktop, sonst die kompakte
  if (!logo) return (
    <>
      <span className="header-logo-default header-logo-stacked"><Logo /></span>
      <span className="header-logo-default header-logo-wide"><Logo variant="wide" /></span>
    </>
  );

  const base = mediaUrl("/media/images/");
  return (
    <img
      className="header-logo-image"
      src={base + logo.images.md}
      srcSet={`${base + logo.images.sm} 300w, ${base + logo.images.md} 800w`}
      sizes="240px"
      alt="Jody Cooper & the Wonders"
    />
  );
}

export default HeaderLogo;
