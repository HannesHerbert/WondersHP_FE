import { useEffect, useState } from "react";
import axios from "axios";
import { FaYoutube, FaInstagram, FaFacebookF } from "react-icons/fa";

const NETWORKS = [
  { key: "youtube", label: "YouTube", Icon: FaYoutube },
  { key: "instagram", label: "Instagram", Icon: FaInstagram },
  { key: "facebook", label: "Facebook", Icon: FaFacebookF },
];

// Social-Media-Icons im Header; Links kommen aus dem Dashboard (Band → Social Media).
// Netzwerke ohne Link werden nicht angezeigt.
function SocialLinks() {
  const [links, setLinks] = useState({});

  useEffect(() => {
    const load = () =>
      axios.get("/api/public/social-links")
        .then((res) => setLinks(res.data.data || {}))
        .catch(() => setLinks({}));
    load();
    // Nach dem Speichern im Dashboard sofort aktualisieren
    window.addEventListener("social-links-updated", load);
    return () => window.removeEventListener("social-links-updated", load);
  }, []);

  const visible = NETWORKS.filter(({ key }) => links[key]);
  if (visible.length === 0) return null;

  return (
    <ul className="social-links">
      {visible.map(({ key, label, Icon }) => (
        <li key={key}>
          <a href={links[key]} target="_blank" rel="noopener noreferrer" aria-label={`Jody Cooper & the Wonders auf ${label}`} title={label}>
            <Icon aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default SocialLinks;
