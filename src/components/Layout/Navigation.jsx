import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../sass/Navigation.scss';
import FlourishText from "../Snippets/FlourishText";
import useAuthStore from "../../store/useAuthStore.js";

const NAV_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/gallery", label: "Gallerie" },
  { path: "/repertoire", label: "Repertoire" },
  { path: "/contact", label: "Kontakt" },
  // Nur mit gültigem Login sichtbar
  { path: "/admin", label: "Admin", requiresAuth: true },
];

function Navigation({viewScope}) {
  const location = useLocation();
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.user !== null);
  const items = NAV_ITEMS.filter((item) => !item.requiresAuth || isLoggedIn);

  // Menü schließen, sobald sich die Route ändert
  useEffect(() => {
    setIsNavExpanded(false);
  }, [location.pathname]);

  const toggleBurgerMenu = () => {
    setIsNavExpanded(!isNavExpanded);
  };

  const getNavClass = (path) => (location.pathname === path ? "activeNav" : "");

  return (
    <div id={`navigation-${viewScope}`} className={isNavExpanded ? 'open' : ''}>

      <button
        type="button"
        id='burger-menu'
        className={isNavExpanded ? 'active' : ''}
        onClick={toggleBurgerMenu}
        aria-label={isNavExpanded ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={isNavExpanded}
      >
        <span className='burger-layer'></span>
        <span className='burger-layer'></span>
        <span className='burger-layer'></span>
      </button>

      <nav className={isNavExpanded ? 'expanded' : ''}>
        <ul>
          {items.map((item, index) => (
            <li
              key={item.path}
              className={`navLink ${getNavClass(item.path)}`}
              style={{ "--i": index }}
            >
              <Link to={item.path}>
                <p><FlourishText drawOnView={false} strokeWidth={4}>{item.label}</FlourishText></p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Navigation;
