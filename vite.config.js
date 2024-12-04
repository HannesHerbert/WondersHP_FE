import { defineConfig, normalizePath } from 'vite';
import react from '@vitejs/plugin-react';



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    host: process.env.VITE_HOST
  }
})
