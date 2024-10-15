import "../../sass/Information.scss";
import ContactForm from "./ContactForm";
import Documents from "./Documents";

function Information() {
  return (
    <section id="information">
      <h2>Informationen</h2>
      <div className="info-container">
        <ContactForm />
        <div className="separator"></div>
        <Documents />
      </div>
    </section>
  );
}

export default Information;
