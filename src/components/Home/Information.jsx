import "../../sass/Information.scss";
import ContactForm from "../Contact/ContactForm";
import Documents from "./Documents";
import FlourishText from "../Snippets/FlourishText";

function Information() {
  return (
    <section id="information">
      <h2><FlourishText>Informationen</FlourishText></h2>
      <div className="info-container">
        <ContactForm />
        <div className="separator"></div>
        <Documents />
      </div>
    </section>
  );
}

export default Information;
