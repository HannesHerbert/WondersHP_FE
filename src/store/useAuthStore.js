import { create } from "zustand";
import axios from "axios";


const useAuthStore = create( set => ({
    // Speicherort fuer user objekt ohne population
    user: null,

    isAuthenticated: function() {
      return this.user !== null
    }, 
    
    validateToken: async () => {

      const token = localStorage.getItem('token');
      let isValid = false;

      try {

          let resp = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/admin/validate`, {}, {
            headers: {
              'Authorization': `Bearer ${token}`
            }  
          });

          if(resp.data.user) {
            
            set({user: resp.data.user});
            isValid = true;
          }

      } catch (error) {
        console.log(error);
        localStorage.removeItem('token');
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