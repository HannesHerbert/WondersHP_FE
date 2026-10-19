import { lazy, Suspense } from "react";
import "./sass/App.scss";
import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import KeyListener from "./services/KeyListener";
import AuthSession from "./services/AuthSession";
import Background from "./components/Layout/Background";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Repertoire from "./pages/Repertoire";
import Contact from "./pages/Contact";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./services/AdminRoute";
import BackgroundStripes from "./components/Layout/BackgroundStripes";
import Notification from "./components/Snippets/Notification";

// Dashboard (Bild-Zuschnitt, Verwaltung) erst laden, wenn jemand eingeloggt /admin öffnet
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function App() {

  return (
    <div id="app">

      <BrowserRouter>

        <KeyListener />
        <AuthSession />
        <Notification />

        <Routes>

          <Route path="/" element={<Layout />}>

            <Route index element={<Home/>}/>

            <Route path="/gallery" element={<Gallery />} />

            <Route path="/repertoire" element={<Repertoire />} />

            <Route path="/contact" element={<Contact />} />

            <Route path="/impressum" element={<Impressum />} />

            <Route path="/datenschutz" element={<Datenschutz />} />

            <Route path="/login" element={<AdminLogin />} />

            <Route path="*" element={<Navigate to="/" replace />} />

            {/* Nur mit gültigem Login-Token erreichbar */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Suspense fallback={null}><AdminDashboard /></Suspense>} />
            </Route>

          </Route>

        </Routes>

      </BrowserRouter>

    </div>
  );
}

export default App;
