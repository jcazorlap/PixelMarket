import React from 'react';

import logoImg from '../assets/logoPixelMarket.png';

const Header = () => {
  return (
    <header className="main-header">
      <div className="logo-container">
        <img src={logoImg} alt="PixelMarket Logo" className="logo-img" />
        <div className="logo-text">PÍXEL<span className="accent-text">MARKET</span></div>
      </div>
      <Navbar />
    </header>
  );
};

const Navbar = () => {
  return (
    <nav>
      <ul className="nav-links">
        <li><a href="#">Catálogo</a></li>
        <li><a href="#">Perfil</a></li>
        <li><a href="#">Soporte</a></li>
      </ul>
    </nav>
  );
};

export default Header;
