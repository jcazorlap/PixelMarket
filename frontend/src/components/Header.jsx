import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logoPixelMarket.png';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  return (
    <header className="main-header">
      <Link to="/" className="logo-container" style={{ textDecoration: 'none' }}>
        <img src={logoImg} alt="PixelMarket Logo" className="logo-img" />
        <div className="logo-text">PÍXEL<span className="accent-text">MARKET</span></div>
      </Link>
      <Navbar />
    </header>
  );
};

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav>
      <ul className="nav-links">
        <li><Link to="/">Catálogo</Link></li>
        <li>
          {user
            ? <Link to="/perfil" className="nav-username">👤 {user.name}</Link>
            : <Link to="/login">Perfil</Link>
          }
        </li>
        <li><Link to="/contacto">Soporte</Link></li>
      </ul>
    </nav>
  );
};

export default Header;
