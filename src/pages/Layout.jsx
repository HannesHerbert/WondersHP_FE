// import { Outlet } from 'react-router-dom';
// import { useEffect } from 'react';
// import Header from '../components/layout/Header';
// import useAuthStore from '../store/useAuthStore';
// import Nav from '../components/layout/Nav';
// import Notification from '../components/Notification';
// import ReportModal from '../components/user/ReportModal';
// import LoadingSpinner from '../components/user/LoadingSpinner';
import AdminLogin from "./AdminLogin";
import "../sass/Layout.scss";
import Header from "../components/Layout/Header";
import { Outlet } from "react-router-dom";
import BackgroundStripes from "../components/Layout/BackgroundStripes";
import Background from "../components/Layout/Background";
import Navigation from "../components/Layout/Navigation";
import AudioPlayer from "../components/Home/AudioPlayer";
import Modal from "../components/Layout/Modal";
import Footer from "../components/Layout/Footer";



function Layout() {
  // const isAuthenticated = useAuthStore(state => state.isAuthenticated());
  // const token = useAuthStore(state => state.getToken());
  // const validateToken = useAuthStore(state => state.validateToken);

  // //Auto Auth
  // useEffect(() => {
  //     if (token && !isAuthenticated) {
  //         validateToken();
  //     }
  // }, []);

  return (
    <div id="layout">
      {/* <Background/> */}
      <BackgroundStripes />

      {/* <AudioPlayer /> */}

      <Header />

      <Modal />

      <Navigation viewScope="desktop" />

      <Outlet />

      <Footer />
    </div>
  );
}

export default Layout;
