import React, { useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const ContactForm = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const hcaptchaSiteKey = import.meta.env.VITE_HCAPTCHA_SITEKEY;

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const formData = {
      firstname,
      email,
      message,
    };
  };

  const onVerifyCaptcha = (token) => {
    console.log("Verified: " + token);
  };

  return (
    <div id="contact-form">
      {/* <h2>Kontaktformular</h2> */}
      <form onSubmit={handleSubmit}>
        
        <div>
          <div className="name-input contact-field">
            <label htmlFor="firstname">Vorname:</label>
            <input
              type="text"
              id="firstname"
              value={firstname}
              onChange={(evt) => setFirstname(evt.target.value)}
              required
            />
          </div>

          <div className="name-input contact-field">
            <label htmlFor="lastname">Nachname:</label>
            <input
              type="text"
              id="lastname"
              value={lastname}
              onChange={(evt) => setLastname(evt.target.value)}
              required
            />
          </div>
        </div>

        <div className="email-input contact-field">
          <label htmlFor="email">E-Mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
            required
          />
        </div>

        <div className="message-input contact-field">
          <label htmlFor="message">Nachricht:</label>
          <textarea
            id="message"
            value={message}
            onChange={(evt) => setMessage(evt.target.value)}
            rows={8}
            required
          ></textarea>
        </div>

        <HCaptcha sitekey={hcaptchaSiteKey} onVerify={onVerifyCaptcha} />

        <button type="submit">Absenden</button>
      </form>
    </div>
  );
};

export default ContactForm;
