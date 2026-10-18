import { useState, useEffect } from "react";
import axios from "axios";

// Spamschutz ohne Captcha: Zeit-Token vom Server (beim Laden geholt) + unsichtbares Honeypot-Feld.
// Die eigentliche Prüfung passiert im Backend.
const EMPTY = { name: "", email: "", message: "" };

const ContactForm = () => {
  const [form, setForm] = useState(EMPTY);
  const [website, setWebsite] = useState(""); // Honeypot – Menschen sehen das Feld nicht
  const [token, setToken] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorText, setErrorText] = useState("");

  const loadToken = () =>
    axios.get("/api/public/contact/token")
      .then((res) => setToken(res.data.token))
      .catch(() => setToken(null));

  useEffect(() => {
    loadToken();
  }, []);

  const update = (field) => (evt) => setForm((prev) => ({ ...prev, [field]: evt.target.value }));

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setStatus("sending");
    setErrorText("");

    try {
      await axios.post("/api/public/contact", { ...form, website, token });
      setStatus("sent");
      setForm(EMPTY);
      loadToken(); // neues Token für eine weitere Nachricht
    } catch (error) {
      setStatus("error");
      setErrorText(error.response?.data?.message || "Die Nachricht konnte nicht gesendet werden. Bitte versuch es später noch einmal.");
      // Abgelaufenes oder fehlendes Token: neues holen, damit der zweite Versuch klappt
      if (error.response?.status === 400) loadToken();
    }
  };

  if (status === "sent") {
    return (
      <div id="contact-form">
        <div className="contact-success" role="status">
          <h3>Danke für deine Nachricht!</h3>
          <p>Wir melden uns so schnell wie möglich per E-Mail bei dir.</p>
          <button type="button" onClick={() => setStatus("idle")}>Weitere Nachricht schreiben</button>
        </div>
      </div>
    );
  }

  return (
    <div id="contact-form">
      <form onSubmit={handleSubmit} noValidate={false}>

        <div className="contact-field">
          <label htmlFor="contact-name">Name</label>
          <input
            type="text"
            id="contact-name"
            autoComplete="name"
            maxLength={120}
            value={form.name}
            onChange={update("name")}
            required
          />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-email">E-Mail</label>
          <input
            type="email"
            id="contact-email"
            autoComplete="email"
            maxLength={254}
            value={form.email}
            onChange={update("email")}
            required
          />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-message">Nachricht</label>
          <textarea
            id="contact-message"
            value={form.message}
            onChange={update("message")}
            rows={8}
            minLength={5}
            maxLength={5000}
            required
          ></textarea>
        </div>

        {/* Honeypot: für Menschen unsichtbar und nicht per Tastatur erreichbar */}
        <div className="contact-hp" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            type="text"
            id="contact-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(evt) => setWebsite(evt.target.value)}
          />
        </div>

        {status === "error" && <p className="contact-error" role="alert">{errorText}</p>}

        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Wird gesendet …" : "Nachricht senden"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
