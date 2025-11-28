import { useState, useEffect, useRef } from "react";
import "./sass/App.scss";
import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import KeyListener from "./services/KeyListener";
import Background from "./components/Layout/Background";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Impressum from "./pages/Impressum";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./services/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import BackgroundStripes from "./components/Layout/BackgroundStripes";



function App() {

  return (
    <div id="app">

      <BrowserRouter>

        <KeyListener />

        <Routes>

          <Route path="/" element={<Layout />}>

            <Route index element={<Home/>}/>

            <Route path="/gallery" element={<Gallery />} />

            <Route path="/contact" element={<Contact />} />

            <Route path="/impressum" element={<Impressum />} />

            <Route path="/login" element={<AdminLogin />} />

            <Route path="*" element={<Navigate to="/" replace />} />

{/* TODO: AdminRoute aktivieren*/} 
            {/* <Route element={<AdminRoute />}> */}
              <Route path="/admin" element={<AdminDashboard />} />
            {/* </Route> */}

          </Route>

        </Routes>

      </BrowserRouter>

    </div>
  );
}

export default App;
