import React, { useState } from "react";
import HCaptcha from '@hcaptcha/react-hcaptcha';


const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const hcaptchaSiteKey = import.meta.env.VITE_HCAPTCHA_SITEKEY


  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const formData = {
      name,
      email,
      message,
    };
  };


  const onVerifyCaptcha = (token) => {
    console.log("Verified: " + token)
  }



  return (
    <div id="contact-form">
      {/* <h2>Kontaktformular</h2> */}
      <form onSubmit={handleSubmit}>
        <div className="name-input contact-field">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(evt) => setName(evt.target.value)}
            required
          />
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
            required>

          </textarea>
        </div>

        <HCaptcha sitekey={hcaptchaSiteKey} onVerify={onVerifyCaptcha}/>

        <button type="submit">Absenden</button>
      </form>
    </div>
  );
};

export default ContactForm;
