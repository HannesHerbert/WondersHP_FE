import { create } from "zustand";
import axios from "axios";


/** Ablaufzeitpunkt (ms) aus dem JWT lesen – nur zur Anzeige-Steuerung, geprüft wird im Backend */
export function tokenExpiresAt(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

const useAuthStore = create( set => ({
    // Speicherort fuer user objekt ohne population
    user: null,

    isAuthenticated: function() {
      return this.user !== null
    }, 
    
    validateToken: async () => {

      const token = localStorage.getItem('token');
      let isValid = false;

      // Kein oder abgelaufenes Token: gar nicht erst beim Backend nachfragen
      const expiresAt = token && tokenExpiresAt(token);
      if (!token || (expiresAt && expiresAt <= Date.now())) {
        localStorage.removeItem('token');
        set({ user: null });
        return false;
      }

      try {

          let resp = await axios.post(`/api/admin/validate`, {}, {
            headers: {
              'Authorization': `Bearer ${token}`
            }  
          });

          if(resp.data.user) {
            
            set({user: resp.data.user});
            isValid = true;
          }

      } catch (error) {
        localStorage.removeItem('token');
        set({ user: null });
      }

      return isValid
    },

    // Methode zum Speichern des users und des tokens
    authenticate: (user, token) => {
      // Speichere token im localStorage
      localStorage.setItem('token', token);
      // Speichere user Objekt im store
      set({ user: user }); // setze neuen user
    },
  
    // Methode zum Holen des gespeicherten tokens
    getToken: () => localStorage.getItem('token'),
  
    // Methode zum Ausloggen (loeschen des users und des tokens)
    logout: () => {
      // entferne token aus localStorage
      localStorage.removeItem('token');
  
      // entferne user Objekt aus user Store
      set({user: null});
    },

    updateUser: (user) => set({user: user}),

}));
  
export default useAuthStore;