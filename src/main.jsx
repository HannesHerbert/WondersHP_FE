import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App.jsx'
import { API_URL } from './config.js'
import './index.css'

// Alle relativen API-Requests ("/api/...") gehen an das Backend
axios.defaults.baseURL = API_URL

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
