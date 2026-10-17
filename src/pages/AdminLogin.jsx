import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../sass/AdminLogin.scss";
import useNotificationStore from "../store/useNotificationStore.js";
import FlourishText from "../components/Snippets/FlourishText";

function AdminLogin() {
  const usernameRef = useRef();
  const passwordRef = useRef();

  const authenticate = useAuthStore((state) => state.authenticate);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  const token = useAuthStore((state) => state.getToken());
  const validateToken = useAuthStore((state) => state.validateToken);
  const user = useAuthStore((state) => state.user);
  const showNotification = useNotificationStore((state) => state.showNotification);

  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    
    // Erstelle Objekt fuer den Body des Requests
    const loginData = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

        try {
            const response = await axios.post(`/api/login/user`, loginData);

            authenticate(response.data.user, response.data.token);
            showNotification("Erfolgreich eingeloggt", "success");

            navigate("/admin");

        } catch (error) {
            console.log('ERROR:', error);
            showNotification("Login fehlgeschlagen: " + (error.response?.data?.message || "Unbekannter Fehler"), "error");
        }
  };

  return (
    <div id="admin-login">
      <div className="admin-login-container">
        <h2><FlourishText>Admin Login</FlourishText></h2>
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

          <div className="input-field">
            <label htmlFor="passwort">Passwort:</label>
            <input
              type="password"
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
