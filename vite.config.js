// import { defineConfig, normalizePath } from 'vite';
// import react from '@vitejs/plugin-react';



// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   // TODO : change base to '.' before deployment to server
//   /* TODO : change homepage to '.' before deployment to server */

//   base: '/Wonders_HP/frontend/',
//   server: {host: process.env.VITE_HOST}
// })


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // ✅ LOKALE ENTWICKLUNG (Docker)
  base: '/', // ← Wichtig! Für http://localhost:5173/
  
  server: {
    host: true, // 0.0.0.0 für Docker-Netzwerk
    port: 5173,
    fs: {
      // ✅ Shared-media aus Host lesen
      allow: ['..']
    }
  }
});