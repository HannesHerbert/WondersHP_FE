import { useRef } from "react";
import "../sass/NewUser.scss"
import axios from "axios";

function NewUser() {
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    // Form Submitt
  async function submitHandler(evt) {
    evt.preventDefault();

    // // Wenn ist kürzer als 3 Zeichen, dann Fehlermeldung und early return
    // if (usernameRef.current.value.trim().length < 3) {
    //     setErrormessage(prev => {
    //         return {
    //             username: 'Username should be longer than 3 letters'
    //         }
    //     });
    //     return;
    // }
    // // Wenn password ist kurzer als 5 Zeichen, dann Fehlermeldung und early return
    // if (passwordRef.current.value.trim().length < 5) {
    //     setErrormessage(prev => {
    //         return {
    //             password: 'Password should be longer than 5 symbols'
    //         }
    //     });
    //     return;
    // }
    // // Wenn password und wiederhol-password nicht gleich sind, dann Fehlermeldung und early return
    // if (passwordRepeatRef.current.value !== passwordRef.current.value) {
    //     setErrormessage(prev => {
    //         return {
    //             passwordRepeat: `Passwords are not identical`
    //         }
    //     });
    //     return;
    // }

    // Erstelle User-Objekt fuer den Body des Requests
    let registrationData = {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
    };

    // Sende Request an /register endpoint der API
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/admin/create-user`, registrationData);

        // // display eine 'SUCCESS' Meldung und navigiere zu Login
        // alertSuccessHandler(`Thank you for registration, ${registrationData.username}!`);
        // navigate('/auth/login');

    } catch (error) {
        console.log(error);
        // // Display eine Fehlermeldung
        // alertFailHandler(error.response.data.message);
    }
};
  
    return (
      <div id="new-user">  
        <h1>Contact Form</h1>
        <form action="/submit-form" onSubmit={submitHandler} method="post">
          <label htmlFor="name">Name:</label>
          <input type="text" id="username" name="username" placeholder="Username" ref={usernameRef} required/>
  
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="E-mail" ref={emailRef} required/>
  
          <label htmlFor="passwort">Passwort:</label>
          <input type="text" id="password" name="password" placeholder="Password" ref={passwordRef} required/>
  
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  };
  
  export default NewUser