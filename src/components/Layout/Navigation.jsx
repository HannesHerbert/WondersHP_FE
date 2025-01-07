import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../sass/Navigation.scss';

function Navigation({viewScope}) {
  const location = useLocation();
  const [isBurgerActive, setBurgerActive] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const toggleBurgerMenu = () => {
    setBurgerActive(!isBurgerActive);
    setIsNavExpanded(!isNavExpanded);
    console.log('click');
  };

  const getNavClass = (path) => (location.pathname === path ? "activeNav" : "");

  return (
    <div id={`navigation-${viewScope}`}>

      <div id='burger-menu' className={isBurgerActive ? 'active' : ''} onClick={toggleBurgerMenu}>
        <div className='burger-layer'></div>
        <div className='burger-layer'></div>
        <div className='burger-layer'></div>
      </div>

      <nav className={isNavExpanded ? 'expanded' : ''}>
        <ul className="">
          <li className={`navLink ${getNavClass("/")}`}>
            <Link to="/">
              <p className="">Home</p>
            </Link>
          </li>

          <li className={`navLink ${getNavClass("/gallery")}`}>
            <Link to="/gallery">
              <p className="">Gallery</p>
            </Link>
          </li>

          <li className={`navLink ${getNavClass("/contact")}`}>
            <Link to="/contact">
              <p className="">Contact</p>
            </Link>
          </li>

          <li className={`navLink ${getNavClass("/impressum")}`}>
            <Link to="/impressum">
              <p className="">Impressum</p>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navigation;
