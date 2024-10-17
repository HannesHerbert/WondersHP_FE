import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../sass/AdminLogin.scss";

function AdminLogin() {
  const usernameRef = useRef();
  const passwordRef = useRef();

  const authenticate = useAuthStore((state) => state.authenticate);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  const token = useAuthStore((state) => state.getToken());
  const validateToken = useAuthStore((state) => state.validateToken);
  const user = useAuthStore((state) => state.user)

  // Notification Handler function
  // const notificationHandler = useNotificationStore(state => state.notificationHandler);

  // Wenn die Daten zum Server korrekt gesendet sind, wird ein Alert mit Success erzeugt
  // function alertSuccessHandler(msg) {
  //     notificationHandler('success', msg)
  // }
  // Wenn bei register ein Fehler, wird ein Alert mit Fehlermeldung erzeugt
  // function alertFailHandler(msg) {
  //     notificationHandler('fail', msg)
  // }

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (token && !isAuthenticated) {
  //     validateToken();
  //   }
  // }, []);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     console.log(user);
      
  //     navigate("/admin");
  //   }
  // }, [isAuthenticated]);

  const submitHandler = async (event) => {
    event.preventDefault();
    
    // Erstelle Objekt fuer den Body des Requests
    const loginData = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/login/user`, loginData);

            authenticate(response.data.user, response.data.token);

            navigate("/admin");

        } catch (error) {
            console.log('ERROR:', error);
            // Display eine Fehlermeldung
            // alertFailHandler(error.response.data.message);
        }
  };

  return (
    <div id="admin-login">
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        <form
          className="login-form"
          action="/submit-form"
          onSubmit={submitHandler}
          method="post"
        >
          <div className="input-field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              ref={usernameRef}
              required
            />
          </div>

          {/* <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="E-mail" ref={emailRef} required/> */}

          <div className="input-field">
            <label htmlFor="passwort">Passwort:</label>
            <input
              type="text"
              id="password"
              name="password"
              placeholder="Password"
              ref={passwordRef}
              required
            />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
