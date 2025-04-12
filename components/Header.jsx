// components/Header.jsx
import { useState } from 'react';
import "../styles/Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <span className="logo-main">LuxMed</span>
            <span className="logo-sub">Lublin</span>
          </div>
          
          <nav className="desktop-nav">
            <ul className="nav-items">
              <li><a href="#" className="nav-link">Strona główna</a></li>
              <li><a href="#" className="nav-link">O nas</a></li>
              <li><a href="#" className="nav-link">Usługi</a></li>
              <li><a href="#" className="nav-link">Lekarze</a></li>
              <li><a href="#" className="nav-link">Kontakt</a></li>
            </ul>
          </nav>
          
          <div className="mobile-menu-toggle">
            <button className="menu-button" onClick={toggleMenu}>
              Menu
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="mobile-nav">
            <ul className="mobile-nav-items">
              <li><a href="#" className="mobile-nav-link">Strona główna</a></li>
              <li><a href="#" className="mobile-nav-link">O nas</a></li>
              <li><a href="#" className="mobile-nav-link">Usługi</a></li>
              <li><a href="#" className="mobile-nav-link">Lekarze</a></li>
              <li><a href="#" className="mobile-nav-link">Kontakt</a></li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;