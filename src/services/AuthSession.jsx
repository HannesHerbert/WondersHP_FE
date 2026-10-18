import { useEffect } from "react";
import useAuthStore, { tokenExpiresAt } from "../store/useAuthStore.js";

// Hält den Login-Zustand aktuell: prüft ein gespeichertes Token beim Seitenaufruf,
// meldet beim Ablauf des Tokens automatisch ab und übernimmt Logout aus anderen Tabs.
function AuthSession() {
  const user = useAuthStore((state) => state.user);
  const validateToken = useAuthStore((state) => state.validateToken);
  const logout = useAuthStore((state) => state.logout);

  // Beim Laden: vorhandenes Token beim Backend prüfen (setzt den User im Store)
  useEffect(() => {
    if (localStorage.getItem("token")) validateToken();
  }, []);

  // Automatisch abmelden, sobald das Token abläuft
  useEffect(() => {
    if (!user) return;
    const expiresAt = tokenExpiresAt(localStorage.getItem("token") || "");
    if (!expiresAt) return;
    const timer = setTimeout(logout, Math.max(0, expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [user]);

  // Token in einem anderen Tab entfernt oder gesetzt
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== "token") return;
      if (event.newValue) validateToken();
      else logout();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return null;
}

export default AuthSession;
