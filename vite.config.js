import { defineConfig, normalizePath } from 'vite';
import react from '@vitejs/plugin-react';



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // TODO : change base to '.' before deployment to server
  /* TODO : change homepage to '.' before deployment to server */

  base: '/Wonders_HP/frontend/',
  server: {host: process.env.VITE_HOST}
})
