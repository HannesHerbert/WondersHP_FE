import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import FlourishText from "./FlourishText";
import { sanitizeLegalText } from "../../services/richText";
import "../../sass/Legal.scss";

// Datenschutz / Impressum: Text kommt aus dem Dashboard (Content → Footer)
function LegalPage({ page, title }) {
  const [content, setContent] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    axios.get(`/api/public/legal/${page}`)
      .then((res) => setContent(res.data.data?.content || ""))
      .catch(() => setFailed(true));
  }, [page]);

  const html = useMemo(() => sanitizeLegalText(content), [content]);

  return (
    <article id="legal" className={page}>
      <h2><FlourishText>{title}</FlourishText></h2>
      {failed && <p>Der Text konnte gerade nicht geladen werden. Bitte versuch es später noch einmal.</p>}
      {content !== null && <div className="legal-body" dangerouslySetInnerHTML={{ __html: html }} />}
    </article>
  );
}

export default LegalPage;
